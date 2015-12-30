-- MySQL dump 10.13  Distrib 5.6.26, for osx10.8 (x86_64)
--
-- Host: localhost    Database: teameeting
-- ------------------------------------------------------
-- Server version	5.6.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP DATABASE IF EXISTS `teameeting`;
CREATE DATABASE IF NOT EXISTS `teameeting` DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
USE `teameeting`;
set character_set_server=utf8;

--
-- Table structure for table `meeting_info`
--

DROP TABLE IF EXISTS `meeting_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meeting_info` (
  `meetusable` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'whether this meeting usable:no/yes/private:0/1/2',
  `meettype1` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'meet type:def/temp/daily:0/1/2',
  `meettype2` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'meet type:def/meeting/p2p/live:0/1/2/3',
  `memnumber` int(11) NOT NULL DEFAULT '0' COMMENT 'meeting member number',
  `meetingid` varchar(64) NOT NULL COMMENT 'meeting identifier',
  `crttime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of creating meeting',
  `deltime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of deleting meeting',
  `userid` varchar(64) NOT NULL DEFAULT '' COMMENT 'user who create this meeting',
  `meetname` varchar(32) NOT NULL DEFAULT '' COMMENT 'name of meeting, system pre-allocate',
  `meetdesc` varchar(64) DEFAULT NULL COMMENT 'description of this meeting',
  `remain1` varchar(16) DEFAULT NULL COMMENT 'remain1',
  PRIMARY KEY (`meetingid`),
  UNIQUE KEY `meetingid` (`meetingid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meeting_session_info`
--

DROP TABLE IF EXISTS `meeting_session_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meeting_session_info` (
  `sessionstatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'status of this session, starting or stopping',
  `sessiontype` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'type of this session:def/meeting/p2p/live:0/1/2/3',
  `sessionnumber` int(11) NOT NULL DEFAULT '0' COMMENT 'user number in this session',
  `meetingid` varchar(64) NOT NULL DEFAULT '' COMMENT 'meeting identifier',
  `sessionid` varchar(64) NOT NULL COMMENT 'session identifier',
  `begtime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of beginning session',
  `endtime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of ending session',
  `remain1` varchar(16) DEFAULT NULL COMMENT 'remain1',
  PRIMARY KEY (`sessionid`),
  UNIQUE KEY `sessionid` (`sessionid`),
  KEY `meetingid` (`meetingid`),
  CONSTRAINT `meeting_session_info_ibfk_1` FOREIGN KEY (`meetingid`) REFERENCES `meeting_info` (`meetingid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message_info`
--

DROP TABLE IF EXISTS `message_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_info` (
  `messagetype` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'type of message',
  `messageid` varchar(64) NOT NULL COMMENT 'message identifier',
  `meetingid` varchar(64) NOT NULL DEFAULT '' COMMENT 'meeting id which send to',
  `sessionid` varchar(64) NOT NULL DEFAULT '' COMMENT 'session id which send to',
  `userid` varchar(64) NOT NULL DEFAULT '' COMMENT 'user id who send this message',
  `sendtime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of sending',
  `message` varchar(1024) NOT NULL DEFAULT '' COMMENT 'message content',
  PRIMARY KEY (`messageid`),
  UNIQUE KEY `messageid` (`messageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teameeting_info`
--

DROP TABLE IF EXISTS `teameeting_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teameeting_info` (
  `sversiontype` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'software version type:def/beta/offical',
  `stype` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'software type:def/web/android/ios:0/1/2/3',
  `releasetime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'release time',
  `comname` varchar(64) NOT NULL DEFAULT '' COMMENT 'company name',
  `sname` varchar(32) NOT NULL DEFAULT '' COMMENT 'software name',
  `sversion` varchar(32) NOT NULL COMMENT 'software version',
  `releaser` varchar(16) NOT NULL DEFAULT '' COMMENT 'user who release',
  `releasecomment` varchar(128) NOT NULL DEFAULT '' COMMENT 'comment about this release',
  `releaseurl` varchar(512) NOT NULL DEFAULT '' COMMENT 'url of this release',
  `remain1` varchar(16) DEFAULT NULL COMMENT 'remain1',
  PRIMARY KEY (`sversion`),
  UNIQUE KEY `sversion` (`sversion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_info` (
  `ustatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'online or not:offline/online:0/1',
  `uregtype` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'reginster on which kindof dev:def/web/android/ios:0/1/2/3',
  `ulogindev` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'login on which kindof dev:def/web/android/ios:0/1/2/3',
  `isregister` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'whether register user:no/yes:0/1',
  `uactype` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'user account type:def/email/phone/sys/qq/weixin/weibo:0/1/2/3/4/5/6',
  `userid` varchar(64) NOT NULL COMMENT 'user identifier,system allocate',
  `upass` varchar(128) NOT NULL DEFAULT '' COMMENT 'user account password',
  `uemail` varchar(64) NOT NULL DEFAULT '' COMMENT 'user email',
  `uphone` varchar(16) NOT NULL DEFAULT '' COMMENT 'user phone',
  `uthaccount` varchar(64) DEFAULT NULL COMMENT 'user third party account',
  `uname` varchar(32) NOT NULL DEFAULT '' COMMENT 'user name, system pre-allocate',
  `uregtime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'register time',
  `uiconurl` varchar(512) NOT NULL DEFAULT '' COMMENT 'user icon url',
  `upushtoken` varchar(128) NOT NULL DEFAULT '' COMMENT 'token used to push message',
  `remain1` varchar(16) DEFAULT NULL COMMENT 'remain1',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_meeting_info`
--

DROP TABLE IF EXISTS `user_meeting_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_meeting_info` (
  `userid` varchar(64) NOT NULL DEFAULT '' COMMENT 'user identifier',
  `meetingid` varchar(64) NOT NULL DEFAULT '' COMMENT 'meeting identifier',
  `owner` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'whether meeting owner:0/1/2:def/yes/no',
  `pushable` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'whether this meeting pushable:no/yes:0/1',
  `jointime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of joining meeting',
  PRIMARY KEY (`userid`,`meetingid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_session_info`
--

DROP TABLE IF EXISTS `user_session_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_session_info` (
  `userid` varchar(64) NOT NULL DEFAULT '' COMMENT 'user identifier',
  `sessionid` varchar(64) NOT NULL DEFAULT '' COMMENT 'session identifier',
  `meetingid` varchar(64) NOT NULL DEFAULT '' COMMENT 'meeting identifier',
  `entertime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of entering this session',
  `leavetime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'time of leaving this session',
  PRIMARY KEY (`userid`,`sessionid`),
  KEY `meetingid` (`meetingid`),
  KEY `index_1` (`userid`),
  CONSTRAINT `user_session_info_ibfk_1` FOREIGN KEY (`meetingid`) REFERENCES `meeting_info` (`meetingid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'teameeting'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-17 15:12:01
