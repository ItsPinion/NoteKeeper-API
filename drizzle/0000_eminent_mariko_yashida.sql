CREATE TABLE `notes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`text` varchar(256) NOT NULL,
	`date` datetime NOT NULL,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
