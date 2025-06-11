# Padel App Database Schema

## Overview

This document defines the complete database schema for the Padel App API, designed to support all 78 API endpoints across 11 service domains. The schema is optimized for PostgreSQL but can be adapted for other relational databases.

## Entity Relationship Diagram (ERD)

```
Users ──────┐
│           │
│           ├── UserSessions
│           ├── UserPreferences  
│           ├── UserStats
│           ├── UserConnections (self-referencing)
│           ├── ClubMemberships
│           ├── Bookings
│           ├── Matches (as organizer)
│           ├── MatchParticipants
│           ├── CommunityFollows (self-referencing)
│           ├── CommunityPosts
│           ├── CommunityLikes
│           ├── Payments
│           ├── Notifications
│           └── SupportTickets
│
Clubs ──────┐
│           ├── ClubSports
│           ├── ClubAmenities
│           ├── ClubWorkingHours
│           ├── ClubImages
│           ├── ClubReviews
│           ├── Courts
│           ├── Bookings
│           └── Matches
│
Matches ────┐
│           ├── MatchParticipants
│           └── MatchResults
│
Sports ─────┐
│           ├── ClubSports
│           └── TimeSlots
│
ImageCache ─── (standalone)
StaticImages ─── (standalone)
AppConfig ─── (standalone)
```

## Core Tables

### 1. Users Table
Primary user account information and profile data.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    level DECIMAL(3,1) DEFAULT 5.0 CHECK (level >= 1.0 AND level <= 10.0),
    level_name VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address TEXT,
    age INTEGER CHECK (age >= 10 AND age <= 100),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. User Sessions Table
JWT token management and session tracking.

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 3. User Preferences Table
User playing preferences and settings.

```sql
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    hand VARCHAR(20) DEFAULT 'Правша' CHECK (hand IN ('Правша', 'Левша')),
    position VARCHAR(20) DEFAULT 'Справа' CHECK (position IN ('Справа', 'Слева')),
    preferred_time VARCHAR(20) DEFAULT 'Вечер' CHECK (preferred_time IN ('Утром', 'Днем', 'Вечер')),
    playing_style VARCHAR(50),
    competitive_preference BOOLEAN DEFAULT FALSE,
    gender_preference VARCHAR(20) DEFAULT 'mixed' CHECK (gender_preference IN ('male', 'female', 'mixed')),
    max_travel_distance INTEGER DEFAULT 10, -- km
    notification_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. User Stats Table
Performance statistics and achievements.

```sql
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    total_hours INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    favorite_partners INTEGER DEFAULT 0,
    clubs_visited INTEGER DEFAULT 0,
    average_match_duration INTEGER DEFAULT 90,
    total_points_scored INTEGER DEFAULT 0,
    total_points_conceded INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Clubs Table
Sports venue information.

```sql
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    street_address VARCHAR(200),
    city VARCHAR(100),
    district VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Russia',
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    telegram VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Sports Table
Available sports and their configurations.

```sql
CREATE TABLE sports (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    min_players INTEGER NOT NULL DEFAULT 2,
    max_players INTEGER NOT NULL DEFAULT 4,
    typical_duration INTEGER NOT NULL DEFAULT 90, -- minutes
    equipment JSONB DEFAULT '[]',
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Club Sports Table
Sports offered by each club with pricing.

```sql
CREATE TABLE club_sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
    courts_count INTEGER NOT NULL DEFAULT 1,
    price_per_hour INTEGER NOT NULL, -- in kopecks
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(club_id, sport_id)
);
```

### 8. Courts Table
Individual courts within clubs.

```sql
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    club_sport_id UUID NOT NULL REFERENCES club_sports(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    surface VARCHAR(100),
    lighting VARCHAR(100),
    is_indoor BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    maintenance_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Club Amenities Table
Club facilities and features.

```sql
CREATE TABLE club_amenities (
    club_id UUID PRIMARY KEY REFERENCES clubs(id) ON DELETE CASCADE,
    parking BOOLEAN DEFAULT FALSE,
    wheelchair_accessible BOOLEAN DEFAULT FALSE,
    cafe BOOLEAN DEFAULT FALSE,
    locker_room BOOLEAN DEFAULT FALSE,
    shower BOOLEAN DEFAULT FALSE,
    equipment_rental BOOLEAN DEFAULT FALSE,
    training_available BOOLEAN DEFAULT FALSE,
    kids_programs BOOLEAN DEFAULT FALSE,
    beginner_friendly BOOLEAN DEFAULT FALSE,
    other_amenities JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Club Working Hours Table
Operating hours for each day of the week.

```sql
CREATE TABLE club_working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(club_id, day_of_week)
);
```

### 11. Club Images Table
Club photo gallery.

```sql
CREATE TABLE club_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 12. Bookings Table
Court reservations.

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    confirmation_code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    club_id UUID NOT NULL REFERENCES clubs(id),
    court_id UUID NOT NULL REFERENCES courts(id),
    sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    end_time TIME GENERATED ALWAYS AS (start_time + (duration || ' minutes')::INTERVAL) STORED,
    total_price INTEGER NOT NULL, -- in kopecks
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    cancellation_reason TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE
);
```

### 13. Matches Table
Organized matches between players.

```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id),
    sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
    club_id UUID NOT NULL REFERENCES clubs(id),
    court_id UUID REFERENCES courts(id),
    booking_id UUID REFERENCES bookings(id),
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL DEFAULT 90, -- minutes
    level_name VARCHAR(50),
    level_min DECIMAL(3,1),
    level_max DECIMAL(3,1),
    match_type VARCHAR(50) DEFAULT 'Парный',
    players_needed INTEGER NOT NULL,
    total_players INTEGER NOT NULL,
    price_per_person INTEGER, -- in kopecks
    is_competitive BOOLEAN DEFAULT FALSE,
    gender_preference VARCHAR(20) DEFAULT 'mixed' CHECK (gender_preference IN ('male', 'female', 'mixed')),
    description TEXT,
    cancellation_policy TEXT,
    match_status VARCHAR(20) DEFAULT 'open' CHECK (match_status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')),
    court_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE
);
```

### 14. Match Participants Table
Players participating in matches.

```sql
CREATE TABLE match_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('organizer', 'player')),
    position INTEGER CHECK (position >= 1 AND position <= 4),
    is_confirmed BOOLEAN DEFAULT FALSE,
    join_message TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, user_id),
    UNIQUE(match_id, position)
);
```

### 15. Match Results Table
Match outcomes and scores.

```sql
CREATE TABLE match_results (
    match_id UUID PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE,
    final_score VARCHAR(100),
    winner_team INTEGER CHECK (winner_team IN (1, 2)),
    duration_played INTEGER, -- actual minutes played
    team1_player1_id UUID REFERENCES users(id),
    team1_player2_id UUID REFERENCES users(id),
    team2_player1_id UUID REFERENCES users(id),
    team2_player2_id UUID REFERENCES users(id),
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    additional_stats JSONB DEFAULT '{}',
    recorded_by UUID REFERENCES users(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Community & Social Tables

### 16. User Connections Table
Frequent playing partners and connections.

```sql
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    connection_type VARCHAR(20) DEFAULT 'partner' CHECK (connection_type IN ('partner', 'friend', 'blocked')),
    matches_played INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    first_played_at TIMESTAMP WITH TIME ZONE,
    last_played_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connected_user_id),
    CHECK(user_id != connected_user_id)
);
```

### 17. Community Follows Table
User following relationships.

```sql
CREATE TABLE community_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);
```

### 18. Community Posts Table
User posts and content.

```sql
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_type VARCHAR(20) DEFAULT 'post' CHECK (post_type IN ('welcome', 'post', 'match_result', 'achievement')),
    title VARCHAR(200),
    content TEXT,
    image_url TEXT,
    match_id UUID REFERENCES matches(id),
    is_public BOOLEAN DEFAULT TRUE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 19. Community Likes Table
Post likes and reactions.

```sql
CREATE TABLE community_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'celebrate')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);
```

## Club Management Tables

### 20. Club Memberships Table
User memberships at clubs.

```sql
CREATE TABLE club_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    membership_type VARCHAR(50) DEFAULT 'basic',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, club_id)
);
```

### 21. Club Reviews Table
User reviews and ratings for clubs.

```sql
CREATE TABLE club_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    visit_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, club_id)
);
```

## Payment & Financial Tables

### 22. Payments Table
Payment transactions.

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    match_id UUID REFERENCES matches(id),
    payment_type VARCHAR(20) DEFAULT 'booking' CHECK (payment_type IN ('booking', 'match', 'membership', 'fee')),
    amount INTEGER NOT NULL, -- in kopecks
    currency VARCHAR(3) DEFAULT 'RUB',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    gateway_response JSONB,
    refund_amount INTEGER DEFAULT 0,
    refund_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE
);
```

## Support & Communication Tables

### 23. Notifications Table
User notifications and alerts.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE
);
```

### 24. Support Tickets Table
Customer support requests.

```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'booking', 'payment', 'technical', 'account')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);
```

## Configuration & System Tables

### 25. Time Slots Table
Available booking time slots.

```sql
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
    start_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    end_time TIME GENERATED ALWAYS AS (start_time + (duration || ' minutes')::INTERVAL) STORED,
    period VARCHAR(20) CHECK (period IN ('morning', 'afternoon', 'evening', 'night')),
    is_popular BOOLEAN DEFAULT FALSE,
    price_modifier DECIMAL(5,2) DEFAULT 1.00, -- multiplier for base price
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sport_id, start_time, duration)
);
```

### 26. App Configuration Table
Application settings and configuration.

```sql
CREATE TABLE app_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 27. Image Cache Table
AI-generated image cache metadata.

```sql
CREATE TABLE image_cache (
    cache_key VARCHAR(32) PRIMARY KEY, -- MD5 hash
    prompt TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    style VARCHAR(50),
    file_path TEXT NOT NULL,
    file_size INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 0,
    is_mock BOOLEAN DEFAULT FALSE
);
```

### 28. Static Images Table
Static image catalog.

```sql
CREATE TABLE static_images (
    id VARCHAR(100) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes and Performance Optimization

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_active ON users(is_active, last_active);

-- Session indexes  
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at);

-- Club indexes
CREATE INDEX idx_clubs_location ON clubs(latitude, longitude);
CREATE INDEX idx_clubs_active ON clubs(is_active);
CREATE INDEX idx_clubs_rating ON clubs(rating DESC);

-- Booking indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_club_id ON bookings(club_id);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, start_time);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_code);

-- Match indexes
CREATE INDEX idx_matches_organizer ON matches(organizer_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_club ON matches(club_id);
CREATE INDEX idx_matches_status ON matches(match_status);
CREATE INDEX idx_matches_sport ON matches(sport_id);
CREATE INDEX idx_matches_location_date ON matches(club_id, match_date);

-- Match participants indexes
CREATE INDEX idx_match_participants_match ON match_participants(match_id);
CREATE INDEX idx_match_participants_user ON match_participants(user_id);

-- Community indexes
CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_posts_type ON community_posts(post_type);
CREATE INDEX idx_community_posts_public ON community_posts(is_public, created_at DESC);
CREATE INDEX idx_community_follows_follower ON community_follows(follower_id);
CREATE INDEX idx_community_follows_following ON community_follows(following_id);
CREATE INDEX idx_community_likes_post ON community_likes(post_id);

-- Payment indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_booking ON payments(booking_id);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at DESC);

-- Image cache indexes
CREATE INDEX idx_image_cache_accessed ON image_cache(last_accessed);
```

## Triggers and Functions

### Update Timestamps Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (add for other tables with updated_at)
```

### User Stats Update Trigger
```sql
CREATE OR REPLACE FUNCTION update_user_stats_from_match_result()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stats for team 1 players
    IF NEW.team1_player1_id IS NOT NULL THEN
        UPDATE user_stats 
        SET total_matches = total_matches + 1,
            wins = wins + CASE WHEN NEW.winner_team = 1 THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN NEW.winner_team = 2 THEN 1 ELSE 0 END,
            total_hours = total_hours + COALESCE(NEW.duration_played, 90),
            win_rate = ROUND((wins + CASE WHEN NEW.winner_team = 1 THEN 1 ELSE 0 END) * 100.0 / (total_matches + 1), 2)
        WHERE user_id = NEW.team1_player1_id;
    END IF;
    
    -- Similar updates for other players...
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stats_after_match_result 
    AFTER INSERT ON match_results 
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_from_match_result();
```

### Club Rating Update Trigger
```sql
CREATE OR REPLACE FUNCTION update_club_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE clubs 
    SET rating = (
        SELECT ROUND(AVG(rating), 2) 
        FROM club_reviews 
        WHERE club_id = NEW.club_id
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM club_reviews 
        WHERE club_id = NEW.club_id
    )
    WHERE id = NEW.club_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_club_rating_after_review 
    AFTER INSERT OR UPDATE OR DELETE ON club_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_club_rating();
```

## Initial Data Seeds

### Sports Data
```sql
INSERT INTO sports (id, name, icon, description, min_players, max_players, typical_duration, equipment, is_popular) VALUES
('padel', 'Падел', '🎾', 'Популярная ракеточная игра в паре на закрытом корте', 2, 4, 90, '["Ракетка", "Мяч"]', true),
('tennis', 'Теннис', '🎾', 'Классический теннис на открытых и закрытых кортах', 2, 4, 90, '["Ракетка", "Мяч"]', true),
('badminton', 'Бадминтон', '🏸', 'Быстрая игра с воланом в зале', 2, 4, 60, '["Ракетка", "Волан"]', false);
```

### App Configuration Data
```sql
INSERT INTO app_config (key, value, description, is_public, category) VALUES
('booking_rules', '{"min_advance_hours": 1, "max_advance_days": 30, "cancellation_hours": 24, "modification_hours": 4}', 'Booking system rules', true, 'booking'),
('match_rules', '{"min_level_diff": 2.0, "max_participants": 4, "join_deadline_hours": 2}', 'Match organization rules', true, 'matches'),
('payment_methods', '["card", "cash", "bank_transfer", "apple_pay", "google_pay"]', 'Accepted payment methods', true, 'payment'),
('supported_locales', '["ru", "en"]', 'Supported languages', true, 'localization'),
('image_generation', '{"max_width": 2048, "max_height": 2048, "default_style": "realistic"}', 'Image generation settings', false, 'images');
```

### Time Slots Data
```sql
INSERT INTO time_slots (sport_id, start_time, duration, period, is_popular, price_modifier) VALUES
('padel', '07:00', 90, 'morning', false, 0.8),
('padel', '08:30', 90, 'morning', false, 0.9),
('padel', '10:00', 90, 'morning', false, 0.9),
('padel', '11:30', 90, 'morning', false, 1.0),
('padel', '13:00', 90, 'afternoon', false, 1.0),
('padel', '14:30', 90, 'afternoon', false, 1.0),
('padel', '16:00', 90, 'afternoon', false, 1.1),
('padel', '17:30', 90, 'evening', true, 1.2),
('padel', '19:00', 90, 'evening', true, 1.3),
('padel', '20:30', 90, 'evening', true, 1.2),
('padel', '22:00', 90, 'evening', false, 1.0);
```

## Database Constraints and Business Rules

### Booking Constraints
- Cannot book in the past: `CHECK (booking_date >= CURRENT_DATE)`
- Cannot book too far in advance: `CHECK (booking_date <= CURRENT_DATE + INTERVAL '30 days')`
- Duration must be reasonable: `CHECK (duration >= 30 AND duration <= 240)`

### Match Constraints  
- Match date cannot be in the past: `CHECK (match_date >= CURRENT_TIMESTAMP)`
- Players needed cannot exceed total players: `CHECK (players_needed <= total_players)`
- Level range validation: `CHECK (level_min <= level_max)`

### User Constraints
- Email format validation (handled by application)
- Phone format validation (handled by application)
- Age restrictions: `CHECK (age >= 10 AND age <= 100)`

## Performance Considerations

### Partitioning Strategy
Consider partitioning large tables by date:
- `bookings` partitioned by `booking_date` (monthly)
- `matches` partitioned by `match_date` (monthly)  
- `notifications` partitioned by `created_at` (monthly)
- `payments` partitioned by `created_at` (monthly)

### Archival Strategy
- Archive completed bookings older than 2 years
- Archive old notifications after 6 months
- Archive inactive user sessions after 30 days
- Compress old image cache entries after 90 days

### Backup Strategy
- Daily full backups
- Point-in-time recovery enabled
- Critical tables (users, bookings, payments) replicated
- Regular backup restoration testing

## Migration Considerations

### From Mock Data
1. **User Migration**: Hash existing passwords, validate email formats
2. **Club Migration**: Geocode addresses, validate contact information
3. **Booking Migration**: Generate confirmation codes, set proper timestamps
4. **Match Migration**: Link organizers and participants correctly
5. **Image Migration**: Download and cache existing AI-generated images

### Data Validation
- Ensure all foreign key relationships are valid
- Validate geographic coordinates are within reasonable bounds
- Check all timestamps are in proper timezone format
- Verify all monetary amounts are in correct currency (kopecks)

### Testing Strategy
- Load test with realistic data volumes
- Test all constraint validations
- Verify trigger functionality
- Performance test critical queries
- Test backup and recovery procedures

This schema provides a robust foundation for the Padel App API with proper normalization, indexing, and business rule enforcement while maintaining flexibility for future enhancements.