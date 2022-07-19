module.exports = {
  presets: [
    [
      require("@babel/preset-react"),
      {
        runtime: "automatic",
      },
    ],
    require("@babel/preset-typescript"),
  ],
};
