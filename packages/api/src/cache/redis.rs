use std::env;
use redis::{Client, ToRedisArgs, RedisResult, Commands};
use colourful_logger::Logger as Logger;
use lazy_static::lazy_static;

lazy_static! {
    static ref logger: Logger = Logger::new();
}

pub struct Redis {
    client: Client,
}

impl Redis {
    pub fn new() -> Self {
        let redis_url = env::var("REDIS_URL").unwrap_or("redis://localhost:6379".to_string()).to_string();
        logger.info(&format!("Created Client with URL : {}", redis_url), "Redis");
        Redis {
            client: Client::open(redis_url).unwrap(),
        }
    }

    pub fn get<T: ToRedisArgs + std::fmt::Debug>(&self, key: T) -> RedisResult<String> {
        logger.info(&format!("Trying to grab key : {:?}", key), "Redis");
        let mut con = self.client.get_connection()?;
        let rv: Option<String> = con.get(key)?;

        match rv {
            Some(data) => {
                let data: serde_json::Value = serde_json::from_str(data.as_str()).unwrap();
                logger.info("Found value for key", "Redis");

                let data = data.to_string();
                return Ok(data);
            },
            None => {
                logger.warn("No value found for key", "Redis");
                return Err(redis::RedisError::from((redis::ErrorKind::ResponseError, "No value found for key")));
            }
        }
    }

    pub fn set<T: ToRedisArgs + std::fmt::Debug, V: ToRedisArgs + std::fmt::Debug>(&self, key: T, value: V) -> RedisResult<()> {
        logger.info(&format!("Setting Key with data {:?}", key).as_str(), "Redis");
        let mut con = self.client.get_connection()?;
        
        let result: RedisResult<()> = con.set(key, value);
        match result {
            Ok(_) => {
                logger.info("Key and Value have been set", "Redis");
                return Ok(());
            },
            Err(e) => {
                logger.error(&format!("Error setting key : {:?}", e).as_str(), "Redis");
                return Err(e);
            }
        }
    }

    pub fn expire<T: ToRedisArgs + std::fmt::Debug>(&self, key: T, seconds: i64) -> RedisResult<()> {
        logger.info(&format!("Setting Key to expire in {} seconds : {:?}", seconds, key).as_str(), "Redis");
        let mut con = self.client.get_connection()?;
        let result: RedisResult<()> = con.expire(key, seconds);
        
        match result {
            Ok(_) => {
                logger.info("Key has been set to expire", "Redis");
                return Ok(());
            },
            Err(e) => {
                logger.error(&format!("Error setting key to expire : {:?}", e).as_str(), "Redis");
                return Err(e);
            }
        }
    }
}