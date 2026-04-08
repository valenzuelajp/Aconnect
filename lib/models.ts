import { DataTypes } from "sequelize";
import db from "@/lib/db";

export const Alumni = db.define(
  "alumni",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumni_number: DataTypes.STRING,
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    sex: DataTypes.STRING,
    email: DataTypes.STRING,
    alternative_email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    alternative_phone: DataTypes.STRING,
    telephone: DataTypes.STRING,
    year_admitted: DataTypes.INTEGER,
    graduation_year: DataTypes.INTEGER,
    degree: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    student_number: DataTypes.STRING,
    last_login: DataTypes.DATE,
    status: DataTypes.STRING,
    current_job: DataTypes.STRING,
    current_job_organization: DataTypes.STRING,
    current_job_length: DataTypes.STRING,
    soft_skills: DataTypes.TEXT,
    technical_skills: DataTypes.TEXT,
    school: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    verification_token: DataTypes.STRING,
    verification_sent_at: DataTypes.DATE,
  },
  { tableName: "alumni" },
);

export const AdminUser = db.define(
  "admin_users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
  },
  { tableName: "admin_users" },
);

export const Employment = db.define(
  "employment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumni_id: DataTypes.INTEGER,
    employment_status: DataTypes.STRING,
    company_name: DataTypes.STRING,
    job_title: DataTypes.STRING,
    job_description: DataTypes.TEXT,
    year_of_service: DataTypes.INTEGER,
    promotion_count: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  },
  { tableName: "employment" },
);

export const Certification = db.define(
  "certification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumni_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    issuing_org: DataTypes.STRING,
    issue_date: DataTypes.DATEONLY,
    expiration_date: DataTypes.DATEONLY,
    credential_id: DataTypes.STRING,
    credential_url: DataTypes.TEXT,
    certification_image: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { tableName: "certification" },
);

export const ConnectionRequest = db.define(
  "connection_requests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
  },
  { tableName: "connection_requests" },
);

export const Connection = db.define(
  "connections",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
  },
  { tableName: "connections" },
);

export const Event = db.define(
  "events",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: DataTypes.STRING,
    event_date: DataTypes.DATE,
    event_time_duration: DataTypes.STRING,
    location: DataTypes.STRING,
    contact_person: DataTypes.STRING,
    description: DataTypes.TEXT,
    event_image: DataTypes.STRING,
    image: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { tableName: "events" },
);

export const Job = db.define(
  "jobs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_title: DataTypes.STRING,
    company: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    salary_range: DataTypes.STRING,
    qualifications: DataTypes.TEXT,
    contact_details: DataTypes.STRING,
    image_filename: DataTypes.STRING,
    posted_by: DataTypes.INTEGER,
    target_schools: DataTypes.TEXT,
    updated_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    target_courses: DataTypes.TEXT,
  },
  { tableName: "jobs" },
);

export const Post = db.define(
  "post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    post_type: DataTypes.STRING,
    image: DataTypes.STRING,
    recipient_batch: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { tableName: "post" },
);

export const CarouselPhoto = db.define(
  "carousel_photos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    file_name: DataTypes.STRING,
    uploaded_at: DataTypes.DATE,
  },
  { tableName: "carousel_photos" },
);

export const Message = db.define(
  "messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    sent_at: DataTypes.DATE,
  },
  { tableName: "messages" },
);

export const SupportMessage = db.define(
  "support_messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    is_admin: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
  },
  { tableName: "support_messages" },
);

export const ActivityLog = db.define(
  "activity_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumni_id: DataTypes.INTEGER,
    activity: DataTypes.TEXT,
    created_at: DataTypes.DATE,
  },
  { tableName: "activity_logs" },
);

export const EventRegistration = db.define(
  "event_registrations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: DataTypes.INTEGER,
    alumni_id: DataTypes.INTEGER,
    registered_at: DataTypes.DATE,
  },
  { tableName: "event_registrations" },
);

export const EmailQueue = db.define(
  "email_queue",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recipient: DataTypes.TEXT,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    attempts: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    send_after: DataTypes.DATE,
  },
  { tableName: "email_queue" },
);
