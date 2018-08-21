# Install as systemd Service
Copy `wikibase-docker-yml-gui.service` to `/etc/systemd/system`.
Edit `/etc/systemd/system/wikibase-docker-yml-gui.service` and replace `[PATH_TO_PROJECT]` with your project path.
Reload daemon config with `systemctl daemon-reload`.
Start daemon  with `systemctl start wikibase-docker-yml-gui`.
Enable it to run on boot with `systemctl enable wikibase-docker-yml-gui`.
See logs with `journalctl -u wikibase-docker-yml-gui`.
