make: linux darwin windows

darwin:
	nexe index.js -t darwin-x64 -o kubeopenapi-jsonschema-darwin -r "./node_modules/**/*"

linux:
	nexe index.js -t linux-x64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

windows:
	nexe index.js -t windows-x64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"
