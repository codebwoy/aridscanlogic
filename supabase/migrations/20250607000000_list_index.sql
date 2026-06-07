-- Composite index for list queries by tenant + entity type
CREATE INDEX IF NOT EXISTS idx_scanlogic_records_entity_user_created
  ON scanlogic_records (entity_type, user_id, created_date DESC);
