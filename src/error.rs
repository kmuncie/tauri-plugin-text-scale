use serde::{Serialize, ser::Serializer};

/// A specialized [`Result`](std::result::Result) for the text scale plugin.
pub type Result<T> = std::result::Result<T, Error>;

/// Errors that can occur when reading the operating system text scale.
#[derive(Debug, thiserror::Error)]
pub enum Error {
   /// The platform failed to report its text size.
   #[error("failed to read the text scale: {0}")]
   ReadFailed(String),
}

impl Serialize for Error {
   fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
   where
      S: Serializer,
   {
      serializer.serialize_str(self.to_string().as_ref())
   }
}
