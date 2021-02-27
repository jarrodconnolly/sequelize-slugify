## Transactions

A transaction wrapping operations on the Model will be passed by default to the internals of this plugin.

This behaviour can be modified using the `passTransaction` option.

Internally this plugin only calls a `findOne` operation, passing the transaction to this may help in specific Isolation scenarios depending on your underlying database.

Fields modified when creating/updating the slug will be rolled back even if we do not pass the transaction due to the nature of how hooks operate.
