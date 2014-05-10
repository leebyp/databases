DROP DATABASE IF EXISTS chat;

CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
 /* Describe your table here.*/
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` VARCHAR(255),
  `user_id` INT,
  `created_at` TIMESTAMP,
  `modified_at` TIMESTAMP,
  `room_id` INT,
  PRIMARY KEY  (`id`)
);

/* You can also create more tables, if you need them... */
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(70),
  PRIMARY KEY  (`id`)
);

CREATE TABLE `rooms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `roomname` VARCHAR(70),
  PRIMARY KEY  (`id`)
);

ALTER TABLE `messages` ADD CONSTRAINT `messages_fk1` FOREIGN KEY (`user_id`) REFERENCES users(`id`);
ALTER TABLE `messages` ADD CONSTRAINT `messages_fk2` FOREIGN KEY (`room_id`) REFERENCES rooms(`id`);

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/

