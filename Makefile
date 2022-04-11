make: linux darwin windows

#
# ALL SUPPORT
#

darwin: darwin-arm
	nexe index.js -t darwin-x64 -o kubeopenapi-jsonschema-darwin -r "./node_modules/**/*"

linux: linux-arm
	nexe index.js -t linux-x64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

windows: windows-arm
	nexe index.js -t windows-x64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

alpine: alpine-arm
	nexe index.js -t alpine-x64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

#
# ARM SUPPORT
#
darwin-arm:
	nexe index.js -t darwin-arm64 -o kubeopenapi-jsonschema-darwin -r "./node_modules/**/*"

linux-arm:
	nexe index.js -t linux-arm64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

windows-arm:
	nexe index.js -t windows-arm64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

alpine-arm:
	nexe index.js -t alpine-arm64 -o kubeopenapi-jsonschema -r "./node_modules/**/*"

.PHONY: darwin darwin-arm alpine alpine-arm linux linux-arm