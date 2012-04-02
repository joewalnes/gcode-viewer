function parseGCode(gcode, handlers) {
  var abort = false;
  gcode.split('\n').forEach(function(line, i) {
    if (abort) {
      return;
    }
    line = line.replace(/;.*$/, '').trim(); // Remove comments
    if (line) {
      var tokens = line.split(' ');
      if (tokens) {
        var cmd = tokens[0];
        var args = {};
        tokens.splice(1).forEach(function(token) {
          var key = token[0].toLowerCase();
          var value = parseFloat(token.substring(1));
          args[key] = value;
        });
        var handler = handlers[tokens[0]];
        if (handler) {
          var result = handler(args, i + 1);
          if (result === false) {
            abort = true;
            return;
          }
        } else {
          error('Unsupported GCode command at line ' + (i + 1) + ': ' + tokens[0]);
          abort = true;
          return;
        }
      }
    }
  });
}
