-- Migração para atualizar a tabela matches
-- Remove a coluna scoreboard e adiciona scoreTeam1, scoreTeam2 e matchDate

-- IMPORTANTE: Faça backup do banco de dados antes de executar!

-- Remover a coluna scoreboard antiga (se existir)
-- Nota: Se a coluna não existir, você pode ignorar o erro ou verificar antes
ALTER TABLE `matches` DROP COLUMN `scoreboard`;

-- Adicionar as novas colunas
ALTER TABLE `matches`
  ADD COLUMN `scoreTeam1` INT DEFAULT NULL AFTER `status`,
  ADD COLUMN `scoreTeam2` INT DEFAULT NULL AFTER `scoreTeam1`,
  ADD COLUMN `matchDate` DATETIME DEFAULT NULL AFTER `scoreTeam2`;
