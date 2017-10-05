# Steps for setting up Ubuntu Server inside VMware

### Overview





### Installing Ubuntu Server 64 bit into VMware Workstation
1. Install VMware Workstation (player should work also)
2. Download the iso [https://www.ubuntu.com/download/server](https://www.ubuntu.com/download/server)
3. File > New Virtual Machine
4. Select Custom
5. Leave compatibility as is
6. Browse for the iso
7. Personalize it, make sure to add a password
8. Name the machine, and choose where to store it
9. Choose number of processors (can be changed later, we're not doing much so 2 cores is fine)
10. Choose amount of memory to give (can be changed later, we're not doing much so 2048 MB is more than enough)
11. Select Use network address translation
12. Select LSI Logic for I/O Controller type
13. Select SATA for disk type
14. Select create a new virtual disk
15. Select how much space to give it (we're not doing much so 20GB is fine)
16. Default is fine for Disk File
17. Should have something that looks like this

![Example Config](https://i.imgur.com/seb028b.png)

### Initial Setup (In order to paste in VMware go to Edit > Paste)
1. Let vmware do it's thing and do the initial installation
2. Log in
3. Comment out the missing index
  * `sudo nano /etc/apt/sources.list`
  * look for `deb cdrom:[Ubuntu-Server 16.04.3 LTS _Xenial....]` and comment it out with `#`
4. Update the indexes
  * `sudo apt-get update`
5. Upgrade the machine
  * `sudo apt-get upgrade`
6. Reboot for good measure
  * `sudo reboot`
7. Install curl
  * `sudo apt-get install curl`
8. Install git
  * `sudo apt-get install git`
9. Get the ip address of the VM so that you can ssh into it later on
  * `ip a s`
  * Mine was `192.168.147.130` and I found it under `ens33`

### Setting up Openssh 
1. Install openssh-server
  * `sudo apt-get install openssh-server`
2. Make a copy of the original settings
  * `sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.orig`
3. (Optional) Disable password and root login, Enable RSA login
  * `sudo nano /etc/ssh/sshd_config`
  * Comment out `PermitRootLogin`
  * Make sure `RSAAuthentication` and `PubkeyAuthentication` and uncommented and are set to yes
  * Make sure `AuthorizedKeysFile` is uncommented and set to `%h/.ssh/authorized_keys`
  * Uncomment `PasswordAuthentication` and set it to no
  * Save changes `ctrl+x` then `y`
  * Restart the service
    * `sudo service ssh restart`
  * Add id_rsa.pub to authorized_keys
    * Change to home directory
      * `cd ~`
    * Make `.ssh` directory
      * `mkdir .ssh`
    * Add id_rsa.pub to authorized_keys
      * `nano authorized_keys`
  	  * Paste contents of id_rsa.pub
4. (Optional) Add it to your ssh config file
  * Open the config file
  * `nano ~/.ssh/config`
  * Add an entry to it
  ... 
```
  Host <PickAName>
        Hostname <ipAddress>
        User <userName>
```
  * Now you can just say `ssh <PickAName>` to log in to the VM


*Everything from here will be done in via ssh terminal*

### Installing packages for MEAN Stack
1. Install nodejs 8 (*NOT 6*) [https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
  * curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  * Go ahead and install build tools also
    * `sudo apt-get install -y build-essential`
2. Install mongodb [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
  * `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6`
  * `echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list`
  * `sudo apt-get update`
  * `sudo apt-get install -y mongodb-org`
  * Start Mongodb at startup
    * `sudo systemctl enable mongod.service`
3. Install pm2 globally
  * `sudo npm install -g pm2`

### Installing packages for PHP and Mysql
1. Install Mysql
  * `sudo apt-get install mysql-server`
  * Enter a password for the root user
  * Secure mysql
    * `mysql_secure_installation`
    * Read each option, I choose yes for everything except changing root password and `VALIDATE PASSWORD PLUGIN`
2. Install PHP
  * `sudo apt-get install php php-mcrypt php-mysqlphp-fpm`
  * Make copy of the original config
    * `sudo cp /etc/php/7.0/fpm/php.ini /etc/php/7.0/fpm/php.ini.orig`
  * Secure the config
    * `sudo nano /etc/php/7.0/fpm/php.ini`
    * Uncomment and change `cgi.fix_pathinfo` to 0 (line 760, to jump to it use `alt+g 760` )
  * Restart php
    * `sudo systemctl restart php7.0-fpm`
3. Install composer for php [https://getcomposer.org/download/](https://getcomposer.org/download/)
  * Change to home directory
    * `cd ~`
  * `php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"`
  * `php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"`
  * `php composer-setup.php`
  * `php -r "unlink('composer-setup.php');"`
  * Move composer to be on our path
    * `sudo mv composer.phar /usr/local/bin/composer`
    * Check to see if it installed `composer --version`



### Setting up NGINX
1. Install NGINX
  * `sudo apt-get install nginx`
2. Make a copy of the original
  * `sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.orig`
3. Additional setup will be needed depending on if we go with php or MEAN




### Resources
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-in-ubuntu-16-04

# Misc Guides
## Windows
### Installing Windows Subsystem for Linux
1. Follow steps at [https://msdn.microsoft.com/en-us/commandline/wsl/install_guide](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide)

### Generate ssh keys
1. Open bash
2. Generate a public private key, follow defaults for it. You can set a passphrase, but it's not required
  * `ssh-keygen -t rsa -b 4096 -C "<Your Email Here>"`
3. Add ssh key to ssh-agent
  * `eval "$(ssh-agent -s)"`
  * `ssh-add ~/.ssh/id_rsa`
4. Generate ssh key for Webstorm use
 * Instead of following defaults you'll change the path to `/mnt/c/Users/<YourUserName>/.ssh/webstorm_rsa`
 * `ssh-keygen -t rsa -b 4096 -C "<Your Email Here>"`

### Adding ssh keys to the vm
1. View your public key
  * `cat ~/.ssh/id_rsa.pub`
  * `cat /mnt/c/Users/<YourUserName>/.ssh/webstorm_rsa.pub`
2. Highlight and copy your key to paste into `authorized_keys` in the vm
3. Login to the vm in VMware
4. Open up `authorized_keys`
  * `nano ~/.ssh/authorized_keys`
5. In VMware go to Edit > Paste
6. Your key should now be pasted, save and close nano
  * ctrl+x then y
7. Find the ip address of the vm
  * `ip a s`
8. Test ssh connection
  * `ssh ubuntu@<Ip From above>`
  * You shouldn't be prompted for password, it should just log you in
9. Add an entry to ssh config file
  * Open the config file
  * `nano ~/.ssh/config`
  * Add an entry to it
```
  Host <PickAName>
        Hostname <ipAddress>
        User <userName>
```
  * Now you can just say `ssh <PickAName>` to log in to the VM

### Installing nodejs locally
Webstorm requires nodejs and npm for its autocomplete to fully work
1. Download and run the installer, get 8.6 latest features [https://nodejs.org/en/](https://nodejs.org/en/)
2. All defaults for the installer should be fine

### Setting up Webstorm
1. Download Webstorm [https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)
  * If you don't have a jetbrains student account create one now [https://www.jetbrains.com/student/](https://www.jetbrains.com/student/)
2. Open project in webstorm
3. Add new deployment server
  * Settings>build,execution,deployment>deployment
  * Enter server info
  * Use SFTP for type and provide ssh credentials
    * Your webstorm ssh key will be in your user directory (`c:\Users\<YourUserName>`) under `.ssh` select `webstorm_rsa` **NOT** `webstorm_rsa.pub`
4. Set auto upload
  * Deployment>options
  * Upload changed files...
5. Do initial deployment
  * Right click project>deployment>sync deployed to
 
### Setting up git in bash
1. Set username and email
  * git config --global user.name "<UserName>
  * git config --global user.email "<Email>"
  * git config --globabl core.editor "nano"
