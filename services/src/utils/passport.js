const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { fetchUserCredentialsById } = require("../modals/employee.firebase");
const fs = require("fs");
const path = require("path");
const { fetchAdminCredentialsById } = require("../modals/user.firebase");

const pathToKey = path.join(__dirname, "../..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

module.exports = (passport) => {
  passport.use(
    "employee-jwt",
    new JwtStrategy(options, function (jwt_payload, done) {
      fetchUserCredentialsById(jwt_payload.sub)
        .then((result) => {
          if (result) {
            return done(null, { ...result, role: "employee" });
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          console.error(err);
          return done(err, false);
        });
    }),
  );

  passport.use(
    "admin-jwt",
    new JwtStrategy(options, function (jwt_payload, done) {
      fetchAdminCredentialsById(jwt_payload.sub)
        .then((result) => {
          if (result) {
            return done(null, { ...result, role: "admin" });
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          console.error(err);
          return done(err, false);
        });
    }),
  );
};
