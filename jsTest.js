const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
},
    (accessToken, refreshToken, porfile, done) => {
        return done(null, profile)
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req,res) => {
    res.send("login")
})

app.get("/auth/google", passport.authenicate("google", { scope: ["profile", "email"]}));

app.get("/auth/google/callback", passport.authenicate('google', {failureRedirect: "/"}), (req, res) => {
    res.redirect('/profile')
})

app.get("/profile", (req, res) => {
    res.send()
})

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/")
})