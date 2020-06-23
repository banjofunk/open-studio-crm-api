import dig from 'object-dig';

const checkAuthGroup = (event, group) => {
  const rolesAttribute =
    dig(event, 'requestContext', 'authorizer', 'claims', 'cognito:groups') ||
    '';
  const roles = rolesAttribute.split(',') || [];
  return roles.includes(group);
};

export default checkAuthGroup;

// export AUTHORIZER='{"claims": {"cognito:groups": "admin, teacher"}}'
