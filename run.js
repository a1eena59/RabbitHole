const { spawn } = require('child_process');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  backend: '\x1b[33m',   // Yellow
  frontend: '\x1b[32m',  // Green
  extension: '\x1b[36m', // Cyan
  system: '\x1b[35m',    // Magenta
};

const processes = [];
let isCleaningUp = false;

function startProcess(name, command, args, cwd, color) {
  console.log(`${colors.system}[System] Starting ${name}...${colors.reset}`);
  
  const isWin = process.platform === 'win32';
  
  // On Windows, passing an array of args with shell: true triggers a deprecation warning in modern Node.js.
  // Instead, we concatenate the command and args into a single string.
  const spawnCommand = isWin ? `${command} ${args.join(' ')}` : command;
  const spawnArgs = isWin ? [] : args;
  
  const proc = spawn(spawnCommand, spawnArgs, {
    cwd: path.resolve(__dirname, cwd),
    shell: isWin,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  processes.push({ name, proc });

  const logData = (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${color}[${name}]${colors.reset} ${line}`);
      }
    });
  };

  proc.stdout.on('data', logData);
  proc.stderr.on('data', logData);

  proc.on('close', (code) => {
    console.log(`${colors.system}[System] ${name} process exited with code ${code}${colors.reset}`);
    if (!isCleaningUp) {
      cleanup();
    }
  });

  proc.on('error', (err) => {
    console.error(`${color}[${name}] Error starting process:${colors.reset}`, err.message);
  });
}

function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  
  console.log(`\n${colors.system}[System] Shutting down all processes...${colors.reset}`);
  
  processes.forEach(({ name, proc }) => {
    if (proc.pid && !proc.killed) {
      console.log(`${colors.system}[System] Killing ${name} (PID: ${proc.pid})${colors.reset}`);
      try {
        if (process.platform === 'win32') {
          // On Windows, taskkill /F /T kills the process tree, preventing orphaned processes.
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t'], { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
      } catch (e) {
        // Process might have already exited
      }
    }
  });
  
  // Allow a brief moment for processes to be killed before exiting the runner script
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGHUP', cleanup);

// Start each service
startProcess('Backend', 'uv', ['run', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], 'backend', colors.backend);
startProcess('Frontend', 'pnpm', ['dev'], 'frontend', colors.frontend);
startProcess('Extension', 'pnpm', ['dev'], 'extension', colors.extension);
