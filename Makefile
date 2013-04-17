MOCHA = ./node_modules/.bin/mocha 

test:
	$(MOCHA) -r should -R spec --recursive

test-low:
	$(MOCHA) -r should --recursive

.PHONY: test