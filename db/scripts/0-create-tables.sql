CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `locale` varchar(255) DEFAULT NULL,
  `status` enum('active','suspended','deleted') NOT NULL DEFAULT 'active',
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `sex` enum('male','female','other') DEFAULT NULL,
  `dateFormat` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `UserPreferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `isPomodoroEnabled` tinyint NOT NULL DEFAULT '1',
  `isBookListEnabled` tinyint NOT NULL DEFAULT '1',
  `toDoColumnName` varchar(256) DEFAULT NULL,
  `inProgressColumnName` varchar(256) DEFAULT NULL,
  `doneColumnName` varchar(256) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_5f8256554b2eec66fda266f625` (`userId`),
  CONSTRAINT `FK_5f8256554b2eec66fda266f625b` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Week` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('planned','in-progress','completed') NOT NULL DEFAULT 'planned',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_6f117821bfedef8a2bb0f51b21e` (`userId`),
  CONSTRAINT `FK_6f117821bfedef8a2bb0f51b21e` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `status` enum('created','to-do','in-progress','done') NOT NULL DEFAULT 'created',
  `priority` enum('low','medium','high') DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `boardRank` varchar(512) DEFAULT NULL,
  `backlogRank` varchar(512) DEFAULT NULL,
  `weekId` int DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_b9a04beac0d49f34e711895715c` (`userId`),
  KEY `FK_01af2d750247fa8e1e2834aca83` (`weekId`),
  CONSTRAINT `FK_01af2d750247fa8e1e2834aca83` FOREIGN KEY (`weekId`) REFERENCES `Week` (`id`),
  CONSTRAINT `FK_b9a04beac0d49f34e711895715c` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `emoji` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_63e936eeeb9ecc6c95a5fc71020` (`userId`),
  CONSTRAINT `FK_63e936eeeb9ecc6c95a5fc71020` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `TaskCategory` (
  `categoryId` int NOT NULL,
  `taskId` int NOT NULL,
  PRIMARY KEY (`categoryId`,`taskId`),
  KEY `IDX_fa1b5dc8af651e60fa1c5d1574` (`categoryId`),
  KEY `IDX_839c4b9360475992437b85c1e7` (`taskId`),
  CONSTRAINT `FK_839c4b9360475992437b85c1e74` FOREIGN KEY (`taskId`) REFERENCES `Task` (`id`),
  CONSTRAINT `FK_fa1b5dc8af651e60fa1c5d1574c` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

