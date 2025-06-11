# Padel App - Rails Optimized Database Schema

## Overview

This document provides a streamlined, Rails-optimized database schema for the Padel App API. The schema follows Rails conventions and best practices, eliminating over-engineering while maintaining all core functionality.

## Key Improvements from Original Schema

### 🚀 Simplifications Applied
- **Removed 12 unnecessary tables** (player_sessions, player_preferences, player_stats, club_amenities, etc.)
- **Consolidated data** into core tables using JSONB columns
- **Applied Rails conventions** (snake_case, proper associations, enums)
- **Leveraged Rails features** (Active Storage, built-in authentication)
- **Used polymorphic associations** for flexible relationships

### 📊 Schema Reduction
- **Original**: 28 tables
- **Optimized**: 16 tables
- **Reduction**: 43% fewer tables

## Core Tables

### 1. Players
Primary player accounts with integrated preferences and stats.

```ruby
# app/models/player.rb
class Player < ApplicationRecord
  # Authentication (use Devise gem)
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  # Associations
  has_many :bookings, dependent: :destroy
  has_many :organized_matches, class_name: 'Match', foreign_key: 'organizer_id', dependent: :destroy
  has_many :match_participants, dependent: :destroy
  has_many :matches, through: :match_participants
  has_many :payments, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :support_tickets, dependent: :destroy
  
  # Self-referential associations for follows/connections
  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'following_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :following
  has_many :followers, through: :passive_follows, source: :follower

  # File attachments
  has_one_attached :avatar

  # Validations
  validates :name, presence: true
  validates :level, numericality: { in: 1.0..10.0 }
  validates :age, numericality: { in: 10..100 }, allow_nil: true

  # Enums
  enum status: { active: 0, inactive: 1, banned: 2 }

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :by_level, ->(min, max) { where(level: min..max) }
  scope :near, ->(lat, lng, radius = 10) { 
    where("ST_Distance(ST_Point(longitude, latitude), ST_Point(?, ?)) < ?", lng, lat, radius * 1000)
  }
end
```

```sql
CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  encrypted_password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  level DECIMAL(3,1) DEFAULT 5.0 CHECK (level >= 1.0 AND level <= 10.0),
  level_name VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address TEXT,
  age INTEGER CHECK (age >= 10 AND age <= 100),
  status INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  reset_password_token VARCHAR(255),
  reset_password_sent_at TIMESTAMP WITH TIME ZONE,
  remember_created_at TIMESTAMP WITH TIME ZONE,
  confirmation_token VARCHAR(255),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX index_players_on_email ON players(email);
CREATE INDEX index_players_on_reset_password_token ON players(reset_password_token);
CREATE INDEX index_players_on_confirmation_token ON players(confirmation_token);
CREATE INDEX index_players_on_location ON players(latitude, longitude);
CREATE INDEX index_players_on_level ON players(level);
```

### 2. Sports
Available sports configuration.

```ruby
# app/models/sport.rb
class Sport < ApplicationRecord
  has_many :club_sports, dependent: :destroy
  has_many :clubs, through: :club_sports
  has_many :bookings, dependent: :restrict_with_error
  has_many :matches, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
  validates :min_players, :max_players, :typical_duration, presence: true, numericality: { greater_than: 0 }

  scope :popular, -> { where(popular: true) }
  scope :active, -> { where(active: true) }
end
```

```sql
CREATE TABLE sports (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  icon VARCHAR(10),
  description TEXT,
  min_players INTEGER NOT NULL DEFAULT 2,
  max_players INTEGER NOT NULL DEFAULT 4,
  typical_duration INTEGER NOT NULL DEFAULT 90,
  equipment JSONB DEFAULT '[]',
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### 3. Clubs
Sports venues with integrated amenities and hours.

```ruby
# app/models/club.rb
class Club < ApplicationRecord
  has_many :club_sports, dependent: :destroy
  has_many :sports, through: :club_sports
  has_many :courts, dependent: :destroy
  has_many :bookings, dependent: :destroy
  has_many :matches, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many_attached :images

  validates :name, presence: true
  validates :latitude, :longitude, presence: true
  validates :rating, numericality: { in: 0.0..5.0 }

  enum status: { active: 0, inactive: 1, maintenance: 2 }

  scope :active, -> { where(status: :active) }
  scope :near, ->(lat, lng, radius = 10) { 
    where("ST_Distance(ST_Point(longitude, latitude), ST_Point(?, ?)) < ?", lng, lat, radius * 1000)
  }

  def update_rating!
    avg_rating = reviews.average(:rating) || 0
    update!(rating: avg_rating.round(2), review_count: reviews.count)
  end
end
```

```sql
CREATE TABLE clubs (
  id BIGSERIAL PRIMARY KEY,
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
  email VARCHAR(255),
  website TEXT,
  telegram VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0.00 AND rating <= 5.00),
  review_count INTEGER DEFAULT 0,
  status INTEGER DEFAULT 0,
  amenities JSONB DEFAULT '{}',
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX index_clubs_on_location ON clubs(latitude, longitude);
CREATE INDEX index_clubs_on_status ON clubs(status);
CREATE INDEX index_clubs_on_rating ON clubs(rating DESC);
```

### 4. Club Sports
Junction table with pricing information.

```ruby
# app/models/club_sport.rb
class ClubSport < ApplicationRecord
  belongs_to :club
  belongs_to :sport
  has_many :courts, dependent: :destroy

  validates :courts_count, :price_per_hour, presence: true, numericality: { greater_than: 0 }
  validates :club_id, uniqueness: { scope: :sport_id }

  scope :available, -> { where(available: true) }
end
```

```sql
CREATE TABLE club_sports (
  id BIGSERIAL PRIMARY KEY,
  club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  sport_id BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  courts_count INTEGER NOT NULL DEFAULT 1,
  price_per_hour INTEGER NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(club_id, sport_id)
);
```

### 5. Courts
Individual courts within clubs.

```ruby
# app/models/court.rb
class Court < ApplicationRecord
  belongs_to :club
  belongs_to :club_sport
  has_many :bookings, dependent: :restrict_with_error
  has_many :matches, dependent: :nullify

  validates :name, presence: true

  enum status: { available: 0, unavailable: 1, maintenance: 2 }

  scope :available, -> { where(status: :available) }
end
```

```sql
CREATE TABLE courts (
  id BIGSERIAL PRIMARY KEY,
  club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  club_sport_id BIGINT NOT NULL REFERENCES club_sports(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  surface VARCHAR(100),
  lighting VARCHAR(100),
  indoor BOOLEAN DEFAULT TRUE,
  status INTEGER DEFAULT 0,
  maintenance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### 6. Bookings
Court reservations.

```ruby
# app/models/booking.rb
class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :club
  belongs_to :court
  belongs_to :sport
  has_many :payments, as: :payable, dependent: :destroy
  has_one :match, dependent: :nullify

  validates :confirmation_code, presence: true, uniqueness: true
  validates :booking_date, :start_time, :duration, :total_price, presence: true
  validate :booking_date_not_in_past
  validate :no_overlapping_bookings

  enum payment_status: { pending: 0, paid: 1, failed: 2, refunded: 3 }
  enum status: { confirmed: 0, cancelled: 1, completed: 2, no_show: 3 }

  before_validation :generate_confirmation_code, on: :create
  before_validation :calculate_end_time

  scope :upcoming, -> { where('booking_date >= ?', Date.current) }
  scope :for_date, ->(date) { where(booking_date: date) }

  private

  def generate_confirmation_code
    self.confirmation_code = "PB#{Date.current.strftime('%y%m%d')}#{SecureRandom.hex(3).upcase}"
  end

  def calculate_end_time
    self.end_time = start_time + duration.minutes if start_time && duration
  end

  def booking_date_not_in_past
    errors.add(:booking_date, "cannot be in the past") if booking_date&.< Date.current
  end

  def no_overlapping_bookings
    return unless court && booking_date && start_time && duration

    overlapping = court.bookings.where(booking_date: booking_date)
                      .where.not(id: id)
                      .where(status: [:confirmed, :completed])
                      .where("(start_time, end_time) OVERLAPS (?, ?)", start_time, end_time)
    
    errors.add(:start_time, "conflicts with existing booking") if overlapping.exists?
  end
end
```

```sql
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  confirmation_code VARCHAR(20) NOT NULL UNIQUE,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  sport_id BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  payment_status INTEGER DEFAULT 0,
  payment_method VARCHAR(50),
  status INTEGER DEFAULT 0,
  cancellation_reason TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX index_bookings_on_player_id ON bookings(player_id);
CREATE INDEX index_bookings_on_club_id ON bookings(club_id);
CREATE INDEX index_bookings_on_court_id ON bookings(court_id);
CREATE INDEX index_bookings_on_date_time ON bookings(booking_date, start_time);
CREATE INDEX index_bookings_on_confirmation_code ON bookings(confirmation_code);
```

### 7. Matches
Organized matches with integrated results.

```ruby
# app/models/match.rb
class Match < ApplicationRecord
  belongs_to :organizer, class_name: 'User'
  belongs_to :sport
  belongs_to :club
  belongs_to :court, optional: true
  belongs_to :booking, optional: true
  has_many :match_participants, dependent: :destroy
  has_many :participants, through: :match_participants, source: :user
  has_many :payments, as: :payable, dependent: :destroy
  has_many :posts, dependent: :destroy

  validates :match_date, :duration, :players_needed, :total_players, presence: true
  validate :match_date_not_in_past
  validate :players_needed_not_exceeding_total

  enum status: { open: 0, full: 1, in_progress: 2, completed: 3, cancelled: 4 }
  enum gender_preference: { mixed: 0, male: 1, female: 2 }

  scope :open_for_joining, -> { where(status: :open) }
  scope :upcoming, -> { where('match_date >= ?', Time.current) }

  def spots_available
    total_players - match_participants.confirmed.count
  end

  def can_join?(user)
    open? && spots_available > 0 && !participants.include?(user)
  end

  def record_result!(winner_team:, score:, duration_played: nil)
    update!(
      status: :completed,
      winner_team: winner_team,
      final_score: score,
      duration_played: duration_played || duration
    )
    
    # Update user stats asynchronously
    UpdateUserStatsJob.perform_later(id)
  end

  private

  def match_date_not_in_past
    errors.add(:match_date, "cannot be in the past") if match_date&.< Time.current
  end

  def players_needed_not_exceeding_total
    return unless players_needed && total_players
    errors.add(:players_needed, "cannot exceed total players") if players_needed > total_players
  end
end
```

```sql
CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  organizer_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  sport_id BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  court_id BIGINT REFERENCES courts(id) ON DELETE SET NULL,
  booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 90,
  level_name VARCHAR(50),
  level_min DECIMAL(3,1),
  level_max DECIMAL(3,1),
  match_type VARCHAR(50) DEFAULT 'Парный',
  players_needed INTEGER NOT NULL,
  total_players INTEGER NOT NULL,
  price_per_person INTEGER,
  competitive BOOLEAN DEFAULT FALSE,
  gender_preference INTEGER DEFAULT 0,
  description TEXT,
  cancellation_policy TEXT,
  status INTEGER DEFAULT 0,
  court_booked BOOLEAN DEFAULT FALSE,
  final_score VARCHAR(100),
  winner_team INTEGER,
  duration_played INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX index_matches_on_organizer_id ON matches(organizer_id);
CREATE INDEX index_matches_on_club_id ON matches(club_id);
CREATE INDEX index_matches_on_sport_id ON matches(sport_id);
CREATE INDEX index_matches_on_match_date ON matches(match_date);
CREATE INDEX index_matches_on_status ON matches(status);
```

### 8. Match Participants
Players in matches.

```ruby
# app/models/match_participant.rb
class MatchParticipant < ApplicationRecord
  belongs_to :match
  belongs_to :user

  validates :match_id, uniqueness: { scope: :user_id }
  validates :position, uniqueness: { scope: :match_id }, allow_nil: true

  enum role: { organizer: 0, player: 1 }
  enum status: { pending: 0, confirmed: 1, declined: 2 }

  scope :confirmed, -> { where(status: :confirmed) }
end
```

```sql
CREATE TABLE match_participants (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  role INTEGER DEFAULT 1,
  position INTEGER CHECK (position >= 1 AND position <= 4),
  status INTEGER DEFAULT 0,
  join_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(match_id, player_id),
  UNIQUE(match_id, position)
);
```

### 9. Reviews
Club reviews and ratings.

```ruby
# app/models/review.rb
class Review < ApplicationRecord
  belongs_to :user
  belongs_to :club

  validates :rating, presence: true, numericality: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :club_id }

  after_save :update_club_rating
  after_destroy :update_club_rating

  private

  def update_club_rating
    club.update_rating!
  end
end
```

```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  visit_date DATE,
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(player_id, club_id)
);
```

### 10. Follows
User following relationships.

```ruby
# app/models/follow.rb
class Follow < ApplicationRecord
  belongs_to :follower, class_name: 'User'
  belongs_to :following, class_name: 'User'

  validates :follower_id, uniqueness: { scope: :following_id }
  validate :cannot_follow_self

  private

  def cannot_follow_self
    errors.add(:following, "cannot follow yourself") if follower_id == following_id
  end
end
```

```sql
CREATE TABLE follows (
  id BIGSERIAL PRIMARY KEY,
  follower_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  following_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);
```

### 11. Posts
Community posts with polymorphic associations.

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  belongs_to :postable, polymorphic: true, optional: true
  has_many :likes, dependent: :destroy
  has_one_attached :image

  validates :content, presence: true, unless: :image_attached?

  enum post_type: { general: 0, welcome: 1, match_result: 2, achievement: 3 }
  enum visibility: { public_post: 0, followers_only: 1, private_post: 2 }

  scope :visible_to, ->(user) { 
    where(visibility: :public_post)
      .or(where(visibility: :followers_only, user: user.following))
      .or(where(user: user))
  }

  def image_attached?
    image.attached?
  end
end
```

```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  postable_type VARCHAR(255),
  postable_id BIGINT,
  post_type INTEGER DEFAULT 0,
  visibility INTEGER DEFAULT 0,
  title VARCHAR(200),
  content TEXT,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX index_posts_on_player_id ON posts(player_id);
CREATE INDEX index_posts_on_postable ON posts(postable_type, postable_id);
CREATE INDEX index_posts_on_created_at ON posts(created_at DESC);
```

### 12. Likes
Polymorphic likes for posts and other content.

```ruby
# app/models/like.rb
class Like < ApplicationRecord
  belongs_to :user
  belongs_to :likeable, polymorphic: true

  validates :user_id, uniqueness: { scope: [:likeable_type, :likeable_id] }

  after_create :increment_like_count
  after_destroy :decrement_like_count

  private

  def increment_like_count
    likeable.increment!(:like_count) if likeable.respond_to?(:like_count)
  end

  def decrement_like_count
    likeable.decrement!(:like_count) if likeable.respond_to?(:like_count)
  end
end
```

```sql
CREATE TABLE likes (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  likeable_type VARCHAR(255) NOT NULL,
  likeable_id BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(player_id, likeable_type, likeable_id)
);

CREATE INDEX index_likes_on_likeable ON likes(likeable_type, likeable_id);
```

### 13. Payments
Polymorphic payment handling.

```ruby
# app/models/payment.rb
class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :payable, polymorphic: true

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payment_method, presence: true

  enum status: { pending: 0, processing: 1, completed: 2, failed: 3, refunded: 4 }
  enum payment_type: { booking_payment: 0, match_payment: 1, membership_payment: 2 }

  scope :successful, -> { where(status: [:completed]) }
end
```

```sql
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  payable_type VARCHAR(255) NOT NULL,
  payable_id BIGINT NOT NULL,
  payment_type INTEGER DEFAULT 0,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'RUB',
  payment_method VARCHAR(50) NOT NULL,
  status INTEGER DEFAULT 0,
  transaction_id VARCHAR(255),
  gateway_response JSONB,
  refund_amount INTEGER DEFAULT 0,
  refund_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX index_payments_on_player_id ON payments(player_id);
CREATE INDEX index_payments_on_payable ON payments(payable_type, payable_id);
CREATE INDEX index_payments_on_status ON payments(status);
```

### 14. Notifications
User notifications.

```ruby
# app/models/notification.rb
class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :notifiable, polymorphic: true, optional: true

  validates :title, :message, presence: true

  enum priority: { low: 0, normal: 1, high: 2, urgent: 3 }
  enum notification_type: { 
    booking_confirmed: 0, 
    match_invitation: 1, 
    payment_completed: 2, 
    general_announcement: 3 
  }

  scope :unread, -> { where(read_at: nil) }
  scope :recent, -> { order(created_at: :desc) }

  def mark_as_read!
    update!(read_at: Time.current) unless read?
  end

  def read?
    read_at.present?
  end
end
```

```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  notifiable_type VARCHAR(255),
  notifiable_id BIGINT,
  notification_type INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX index_notifications_on_player_id ON notifications(player_id);
CREATE INDEX index_notifications_on_read_at ON notifications(player_id, read_at);
CREATE INDEX index_notifications_on_notifiable ON notifications(notifiable_type, notifiable_id);
```

### 15. Support Tickets
Customer support.

```ruby
# app/models/support_ticket.rb
class SupportTicket < ApplicationRecord
  belongs_to :user

  validates :subject, :message, presence: true

  enum category: { general: 0, booking: 1, payment: 2, technical: 3, account: 4 }
  enum priority: { low: 0, normal: 1, high: 2, urgent: 3 }
  enum status: { open: 0, in_progress: 1, resolved: 2, closed: 3 }

  before_create :generate_ticket_number

  private

  def generate_ticket_number
    self.ticket_number = "TK#{Date.current.strftime('%y%m%d')}#{SecureRandom.hex(3).upcase}"
  end
end
```

```sql
CREATE TABLE support_tickets (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  category INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 1,
  status INTEGER DEFAULT 0,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX index_support_tickets_on_player_id ON support_tickets(player_id);
CREATE INDEX index_support_tickets_on_ticket_number ON support_tickets(ticket_number);
CREATE INDEX index_support_tickets_on_status ON support_tickets(status);
```

### 16. Active Storage Tables
Rails file attachment handling.

```sql
-- Rails Active Storage tables (generated automatically)
CREATE TABLE active_storage_blobs (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(255),
  metadata TEXT,
  service_name VARCHAR(255) NOT NULL,
  byte_size BIGINT NOT NULL,
  checksum VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE active_storage_attachments (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  record_type VARCHAR(255) NOT NULL,
  record_id BIGINT NOT NULL,
  blob_id BIGINT NOT NULL REFERENCES active_storage_blobs(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE active_storage_variant_records (
  id BIGSERIAL PRIMARY KEY,
  blob_id BIGINT NOT NULL REFERENCES active_storage_blobs(id),
  variation_digest VARCHAR(255) NOT NULL,
  UNIQUE(blob_id, variation_digest)
);
```

## Rails Application Configuration

### Gemfile Recommendations

```ruby
# Core Rails gems
gem 'rails', '~> 7.0'
gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'

# Authentication & Authorization  
gem 'devise'
gem 'pundit' # For authorization policies

# API
gem 'jbuilder'
gem 'rack-cors'

# Background Jobs
gem 'sidekiq'

# Image Processing
gem 'image_processing', '~> 1.2'

# Geospatial
gem 'rgeo'
gem 'activerecord-postgis-adapter'

# Caching & Performance
gem 'redis', '~> 4.0'
gem 'bootsnap', '>= 1.4.4', require: false

# Development & Testing
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'pry-rails'
end

group :development do
  gem 'annotate'
  gem 'bullet'
  gem 'letter_opener'
end
```

### Application Configuration

```ruby
# config/application.rb
class Application < Rails::Application
  config.load_defaults 7.0
  config.api_only = true
  
  # CORS configuration
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'localhost:8081', '127.0.0.1:8081', /exp:\/\//
      resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
    end
  end

  # Background job configuration
  config.active_job.queue_adapter = :sidekiq

  # Time zone
  config.time_zone = 'Moscow'
end
```

## Key Features & Benefits

### 🎯 Rails Best Practices Applied

1. **Convention over Configuration**: Standard Rails naming and structure
2. **DRY Principle**: Eliminated duplicate data storage
3. **Single Responsibility**: Each table has a clear, focused purpose
4. **Polymorphic Associations**: Flexible relationships (payments, likes, notifications)
5. **Built-in Features**: Leveraging Rails' authentication, file uploads, caching

### 🚀 Performance Optimizations

1. **Strategic Indexing**: Optimized for common query patterns
2. **JSONB Usage**: Flexible data storage without additional tables
3. **Proper Associations**: Efficient joins and includes
4. **Background Jobs**: Async processing for stats updates
5. **Caching Strategy**: Redis for session and query caching

### 🛡️ Data Integrity

1. **Database Constraints**: Proper validations at DB level
2. **Foreign Key Relationships**: Referential integrity
3. **Enum Usage**: Type safety for status fields
4. **Business Logic Validation**: Rails model validations

### 📱 API-Ready Structure

1. **JSON Serialization**: Optimized for mobile API consumption
2. **Polymorphic Design**: Flexible endpoint responses
3. **Status Tracking**: Proper state management
4. **Error Handling**: Rails standard error responses

## Migration Strategy

### 1. Create Rails Application
```bash
rails new padel_api --api --database=postgresql
cd padel_api
bundle install
```

### 2. Generate Models
```bash
rails generate devise:install
rails generate devise Player
rails generate model Sport name:string slug:string
rails generate model Club name:string latitude:decimal longitude:decimal
# ... continue for all models
```

### 3. Data Migration from Mock
```ruby
# lib/tasks/import_mock_data.rake
namespace :import do
  desc "Import mock data from existing backend"
  task mock_data: :environment do
    # Import players, clubs, matches, etc.
    # Transform JSON structure to Rails models
  end
end
```

### 4. API Controllers
```ruby
# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ApplicationController
  before_action :authenticate_player!, except: [:index, :show]
  respond_to :json
  
  private
  
  def render_success(data, message = nil)
    render json: {
      success: true,
      message: message,
      data: data,
      timestamp: Time.current.iso8601
    }
  end
  
  def render_error(message, status = :unprocessable_entity)
    render json: {
      success: false,
      message: message,
      timestamp: Time.current.iso8601
    }, status: status
  end
end
```

This streamlined schema maintains all functionality while following Rails conventions and best practices, resulting in a more maintainable and scalable codebase.