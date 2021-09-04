export const notificationSchema = {
  title: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    minlength: 3
  },
  summary: {
    type: String,
    required: true,
    maxlength: 100,
  },
  contentType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 2000,
  },
  is_published: {
    type: Boolean,
    default: false,
  },
  is_breaking_news: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    default: new Date(),
  },
  end_date: {
    type: Date,
    default: new Date(),
  },
};
