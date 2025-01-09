# Context Inheritance in Subthreads

When a subthread is created, it inherits a copy of its parent thread's context, allowing it to
operate with the same initial state while maintaining isolation from the parent thread. This design
prevents unintended side effects in parent threads.

## Inheritance Behavior

When a new subthread is created:

1. The subthread receives a new `Context` instance initialized with:
   - The parent thread's model
   - A copy of the parent thread's message history
   - An empty set of relayers
2. The parent thread's state remains unchanged and protected from modifications made within the
   subthread.
3. If the subthread has a prelude, it is applied to the subthread's context.
4. If the subthread returns a value, the value is JSON-serialized and returned to the parent thread.

## Benefits

This inheritance pattern provides several advantages:

1. **State Isolation**: Changes to the subthread's context do not affect the parent thread
2. **Initial State Sharing**: Subthreads start with the same context as their parent, ensuring
   continuity
3. **Thread Safety**: Each thread operates on its own copy of the context, preventing race
   conditions
4. **Independent Evolution**: Subthreads can modify their context without concern for parent thread
   state
