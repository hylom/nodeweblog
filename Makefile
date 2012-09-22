
INSTALL_DIR=/var/nodeweblog
INITD_SCRIPT=/etc/init.d/nodeweblog
EXCLUDE=--exclude tools/ --exclude nodeweblog-initscript --exclude ".*" --exclude Makefile --exclude config.json.sample

DEPENDS=$(INSTALL_DIR) $(INITD_SCRIPT)

install: $(DEPENDS)
	rsync -av $(EXCLUDE) ./ $(INSTALL_DIR)/

install-test:
	rsync -av --dry-run $(EXCLUDE) ./ $(INSTALL_DIR)/

$(INSTALL_DIR):
	mkdir -p $(INSTALL_DIR)

$(INITD_SCRIPT): nodeweblog-initscript
	cp $< $@

