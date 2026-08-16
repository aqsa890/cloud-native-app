.PHONY: lint test install

install:
	pip install -r requirements.txt

lint:
	PYTHONPATH=. pylint app/

test:
	PYTHONPATH=. pytest
