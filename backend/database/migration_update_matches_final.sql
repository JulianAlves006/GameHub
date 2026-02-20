-- Migration: UpdateMatchesScoreAndDate
-- Remove a coluna scoreboard e adiciona scoreTeam1, scoreTeam2 e matchDate

-- Remover a coluna scoreboard antiga
ALTER TABLE `matches` DROP COLUMN `scoreboard`;

-- Adicionar as novas colunas
ALTER TABLE `matches` ADD `scoreTeam1` int NULL AFTER `status`;
ALTER TABLE `matches` ADD `scoreTeam2` int NULL AFTER `scoreTeam1`;
ALTER TABLE `matches` ADD `matchDate` datetime NULL AFTER `scoreTeam2`;
