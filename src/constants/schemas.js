export const notificationSchema = {
  title: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
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
  photo: {
    data: Buffer,
    contentType: String,
  },
  start_date: {
    type: Date,
    default: Date.now(),
  },
  end_date: {
    type: Date,
    default: Date.now() + 90 * 24 * 60 * 60 * 1000,
  },
  department: {
    type: String,
    required: true,
  },
};

export const PageSchema = {
  title: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  blocks: {
    type: Array,
    default: [],
  },
  time: {
    type: Number,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
};

export const placementschema = {
  course: {
    // B.Tech M.Tech MCA
    type: String,
    required: true,
    trim: true,
  },
  academic_year: {
    // 2021-22
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    // CSE
    type: String,
    required: true,
    trim: true,
  },
  min_package: {
    type: Number,
    required: true,
  },
  max_package: {
    type: Number,
    required: true,
  },
  avg_package: {
    type: Number,
    required: true,
  },
  total_placed: {
    type: Number,
    required: true,
  },
  total_students: {
    type: Number,
    required: true,
  },
}