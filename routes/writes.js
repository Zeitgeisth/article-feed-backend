const express = require('express');
const Writes = require('../models/writes');
const {check, validationResult} = require('express-validator');
const router = express.Router();


