interface ConditionTemplateOption {
  dev: string;
  staging: string;
  local: string;
}

const conditionTemplate = (options: ConditionTemplateOption) => {
  if (process.env.E2E_ENV === "Dev") return options.dev;
  if (process.env.E2E_ENV === "Staging") return options.staging;
  if (process.env.E2E_ENV === "Local") return options.local;
};

const setEnvironmentVariable = (
  variableName: string,
  value: string | undefined
) => {
  process.env[variableName] = value;
};

export const dynamicEnvironment = () => {
  setEnvironmentVariable(
    "EAZY_AGENT_URL",
    conditionTemplate({
      dev: "https://dev-eazyagent.eazytestdigital.page",
      staging: "AGENT_STAGING_URL",
      local: "http://localhost:5000",
    })
  );

  setEnvironmentVariable(
    "EAZY_PROFILE_URL",
    conditionTemplate({
      dev: "https://dev-profile.eazytestdigital.page",
      staging: "PROFILE_STAGING_URL",
      local: "http://localhost:5000",
    })
  );

  setEnvironmentVariable(
    "EAZY_CONNECT_URL",
    conditionTemplate({
      dev: "https://dev-admin.eazytestdigital.page",
      staging: "CONNECT_STAGING_URL",
      local: "http://localhost:5000",
    })
  );

  setEnvironmentVariable(
    "EAZY_AGENT_ENDPOINT",
    conditionTemplate({
      dev: "https://dev-eazyagent.eazytestdigital.page",
      staging: "https://dev-eazyagent.eazytestdigital.page",
      local: "http://localhost:5000",
    })
  );
};
