+++
title = "dotfiles"
date = 2024-10-18
slug = "dotfiles"
description = "how I build my workstation environment."
[extra]
  toc = true
+++

I keep updated scripts for this [here](https://github.com/davidemerson/dotfiles.git)

There's a good guide on sway [here](https://wiki.archlinux.org/title/Sway), since that's still a little new for me, coming from dwm and i3.

I used to have an OpenBSD guide here, but I got tired of maintaining that, since I'm consistently disappointed with the desktop experience in OpenBSD. I love and support the project, just not its regular use as a workstation OS.

# Debian 12
If you're using VMWare Workstation on a Windows host, remember to enable the "Enhanced Keyboard" driver in the guest configuration, so you don't have a lockscreen key combination conflict.

Run through standard install. Install just the standard system utilities, and sshd.

Log in as your user. su to root.

Install curl, git, micro, sudo.

```
apt install curl micro git sudo
```

Add your user to sudoers

```
sudoedit /etc/sudoers
```

Install salt-minion

```
mkdir /etc/apt/keyrings

sudo curl -fsSL -o /etc/apt/keyrings/salt-archive-keyring-2023.gpg \
https://repo.saltproject.io/salt/py3/debian/12/amd64/SALT-PROJECT-GPG-PUBKEY-2023.gpg

echo "deb [signed-by=/etc/apt/keyrings/salt-archive-keyring-2023.gpg \
 arch=amd64] https://repo.saltproject.io/salt/py3/debian/12/amd64/latest \
 bookworm main" | tee /etc/apt/sources.list.d/salt.list

apt update

apt install salt-minion
```

Head back to your local user

```
exit
```

Grab this repo. If you're going to fork this and make your own dotfiles, you might want to make a step before the cloning bit where you scp your ssh key to the workstation you're building so you can read/write the repo, and then push your changes back live. If you're just getting a system running, though, read alone is enough here.
```
git clone https://github.com/davidemerson/dotfiles.git
```

Execute the execute.sh script, which refreshes the `/srv/salt/` directory and applies highstate.
```
cd dotfiles
chmod 755 execute.sh
sudo sh execute.sh
```

Run fc-cache to update fonts.

```
fc-cache
```

Keep salt-minion from starting (unnecessary since we're using salt-check). Use your editor of choice to comment out the `pkg_scripts=salt_minion` line in `/etc/rc.conf.local`.

Make your hostname appropriate by editing `/etc/myname` with the editor of your choice.

Reboot
```
sudo reboot
```

# Notes
* You'll note that my `.muttrc` and `.msmtprc` refer to `~/.secrets/mailpass` for credentials. This is a one liner file containing my mail app password, keeping it out of this repo, and allowing me to do things like encrypt it on disk. You can substitute any form of password management here, to accommodate your personal preferences.
* I've always hopped between Debian and OpenBSD for my personal workstation, with the majority of my time spent in Debian for practical reasons. I prefer OpenBSD philosophically, though, and at present, its warts have never been fewer, so it's what I'm running at the moment. If you used a previous version of this repo, it used to be Debian-centric until recently, and the current iteration will break some of that.

# Additional References
Check out how others have done this kind of thing, for inspiration and documentation:
* [sohcahtoa](https://sohcahtoa.org.uk/openbsd.html)
* [jcs](https://jcs.org/2021/07/19/desktop)
* [daulton](https://daulton.ca/2018/08/openbsd-workstation/)
* [eradman](http://eradman.com/posts/openbsd-workstation.html)
