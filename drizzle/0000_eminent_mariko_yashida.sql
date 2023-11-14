CREATE TABLE `notes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`phone` varchar(256) NOT NULL,
	`date` datetime NOT NULL,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
