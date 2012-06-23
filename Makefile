EXTNAME := opera-zeroclick


oex:
	zip -r ${EXTNAME}.oex . -x build/\* -x .git/\*
	cp opera-zeroclick.oex build/

