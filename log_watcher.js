var sys = require("sys"),
    http = require("http");

sys.puts(process.ARGV);
var file = process.ARGV[3];
var hostname = (process.ARGV[4]) ? process.ARGV[4] : "localhost";
var port = (process.ARGV[5]) ? process.ARGV[5] : 8000;
var log_server = http.createClient(port, hostname);
sys.puts("sending logs to " + hostname + ":" + port);

var send_log = function(msg) {
    var req = log_server.request("POST", "/", {"Content-Length":msg.length});
    req.sendBody(msg, encoding="ascii")
    req.finish();
}

var monitor_file = function(filename) {
    sys.puts("monitor_file: monitoring " + filename);
    var cmd = process.createChildProcess("tail", ["-F", filename]);
    cmd.addListener("output", function(data) {
	    sys.puts("output: sending (" + data.length + ")");
	    send_log(data);
	});
    cmd.addListener("error", function(data) {
	    sys.puts("error: " + data);
	});
    cmd.addListener("exit", function(data) {
	    sys.puts("exit: " + data);
	});
};

monitor_file(file);