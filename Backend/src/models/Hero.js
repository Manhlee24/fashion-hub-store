import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Hero = sequelize.define('Hero', {
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING
  },
  subtitle: {
    type: DataTypes.TEXT
  },
  button_text: {
    type: DataTypes.STRING
  },
  button_link: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'hero_sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Hero;
