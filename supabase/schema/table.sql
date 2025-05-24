-- =======================
-- Table: rooms
-- =======================
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT, -- optional room name
    is_active BOOLEAN DEFAULT TRUE
);

-- =======================
-- Table: users
-- =======================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    avatar_url TEXT,
    perm_id TEXT NOT NULL, -- from socket connection
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_user_perm_id_per_room UNIQUE (room_id, perm_id)
);

-- Index to quickly find users in a room
CREATE INDEX idx_users_room_id ON users(room_id);

-- =======================
-- Table: messages
-- =======================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_system_message BOOLEAN DEFAULT FALSE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index to quickly query chat history by room
CREATE INDEX idx_messages_room_id_timestamp ON messages(room_id, timestamp);
