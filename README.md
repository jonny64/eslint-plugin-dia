[dia.js](https://github.com/do-/dia.js/wiki) eslint rules:
| name | description
| --- | ---
| no-ref-plural  | id_${en_plural} identifiers are not allowed
| no-filter-is-deleted  | filter.is_deleted are not allowed, please filter front side
| no-column-width  | draw_table.columns.width is required for each column
| no-mixed-column-width  | draw_table.columns.width mixed unit are not allowed
| no-db-select-hash-bool-misuse | db.select_hash and object-returning db.get results must be checked by a field, not by truthiness

see https://astexplorer.net for node tree
