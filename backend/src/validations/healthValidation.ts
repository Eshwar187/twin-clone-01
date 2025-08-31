import Joi from 'joi';

export const healthValidation = {
  createHealthData: Joi.object({
    date: Joi.date()
      .default(() => new Date()),
    
    water: Joi.object({
      consumed: Joi.number().min(0).max(20).required(),
      goal: Joi.number().min(1).max(20).default(8)
    }),
    
    sleep: Joi.object({
      hours: Joi.number().min(0).max(24).required(),
      quality: Joi.number().integer().min(1).max(5).required(),
      bedtime: Joi.date(),
      wakeTime: Joi.date()
    }),
    
    exercise: Joi.object({
      steps: Joi.number().min(0).max(100000).default(0),
      workouts: Joi.array().items(
        Joi.object({
          type: Joi.string().required(),
          duration: Joi.number().min(1).required(),
          calories: Joi.number().min(0),
          timestamp: Joi.date().default(() => new Date())
        })
      ).default([])
    }),
    
    mood: Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      notes: Joi.string().max(500)
    }),
    
    vitals: Joi.object({
      weight: Joi.number().min(20).max(500),
      heartRate: Joi.number().min(30).max(220),
      bloodPressure: Joi.object({
        systolic: Joi.number().min(70).max(250),
        diastolic: Joi.number().min(40).max(150)
      })
    })
  }),

  updateHealthData: Joi.object({
    water: Joi.object({
      consumed: Joi.number().min(0).max(20),
      goal: Joi.number().min(1).max(20)
    }),
    
    sleep: Joi.object({
      hours: Joi.number().min(0).max(24),
      quality: Joi.number().integer().min(1).max(5),
      bedtime: Joi.date(),
      wakeTime: Joi.date()
    }),
    
    exercise: Joi.object({
      steps: Joi.number().min(0).max(100000),
      workouts: Joi.array().items(
        Joi.object({
          type: Joi.string().required(),
          duration: Joi.number().min(1).required(),
          calories: Joi.number().min(0),
          timestamp: Joi.date()
        })
      )
    }),
    
    mood: Joi.object({
      rating: Joi.number().integer().min(1).max(5),
      notes: Joi.string().max(500)
    }),
    
    vitals: Joi.object({
      weight: Joi.number().min(20).max(500),
      heartRate: Joi.number().min(30).max(220),
      bloodPressure: Joi.object({
        systolic: Joi.number().min(70).max(250),
        diastolic: Joi.number().min(40).max(150)
      })
    })
  }),

  logWater: Joi.object({
    amount: Joi.number().min(0.1).max(5).required(),
    timestamp: Joi.date().default(() => new Date())
  }),

  logSleep: Joi.object({
    hours: Joi.number().min(0).max(24).required(),
    quality: Joi.number().integer().min(1).max(5).required(),
    bedtime: Joi.date(),
    wakeTime: Joi.date(),
    date: Joi.date().default(() => new Date())
  }),

  logExercise: Joi.object({
    type: Joi.string().required(),
    duration: Joi.number().min(1).required(),
    calories: Joi.number().min(0),
    steps: Joi.number().min(0),
    timestamp: Joi.date().default(() => new Date())
  }),

  createHabit: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500),
    category: Joi.string().valid('health', 'productivity', 'personal', 'social').required(),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').required(),
    target: Joi.number().min(1).required()
  }),

  updateHabit: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    category: Joi.string().valid('health', 'productivity', 'personal', 'social'),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly'),
    target: Joi.number().min(1),
    active: Joi.boolean()
  })
};
