EXTNAME := opera-zeroclick


oex:
	zip -r ${EXTNAME}.oex . -x build/\* -x .git/\*
	mv opera-zeroclick.oex build/

