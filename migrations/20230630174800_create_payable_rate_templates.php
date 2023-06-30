<?php

class CreatePayableRateTemplatesTable extends AbstractMatecatMigration {

    public $sql_up = [ '
        CREATE TABLE `payable_rate_templates` (
          `id` INT UNSIGNED NOT NULL,
          `uid` BIGINT(20) UNSIGNED NOT NULL,
          `version` INT(11) UNSIGNED NOT NULL DEFAULT 1,
          `name` VARCHAR(255) NOT NULL,
          `breakdowns` TEXT NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE INDEX `uid_name_idx` (`uid` ASC, `name` ASC));
    ' ];

    public $sql_down = [ '
        DROP TABLE `payable_rate_templates`;
    ' ];
}
