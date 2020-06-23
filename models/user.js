
module.exports = (sequelize, Datatypes) => {
  const User = sequelize.define("User", {
    cognitoId: { type: Datatypes.STRING },
    mindbodyId: { type: Datatypes.INTEGER },
    badgeId: { type: Datatypes.STRING, defaultValue: '' },
    birthday: { type: Datatypes.STRING, defaultValue: '' },
    description: { type: Datatypes.TEXT, defaultValue: '' },
    firstName: { type: Datatypes.STRING },
    lastName: { type: Datatypes.STRING },
    phone: { type: Datatypes.STRING },
    email: { type: Datatypes.STRING },
    gender: { type: Datatypes.STRING },
    status: { type: Datatypes.STRING },
    preferences: { type: Datatypes.JSON },
    relationships: { type: Datatypes.JSON },
    emergencyContact: { type: Datatypes.JSON },
    roles: { type: Datatypes.STRING },
  }, {
    timestamps: true,
    getterMethods: {
      roles () {
        return JSON.parse(this.getDataValue("roles") || "[]");
      }
    },
    setterMethods: {
      roles (value) {
        this.setDataValue('roles', JSON.stringify(value))
      }
    }
  })

  User.associate = (models) => {
    const { Address, Location, Organization, ClassEvent, ClassEventUser, PhoneNumber } = models
    User.belongsTo(Organization, {
      as: 'organization',
      foreignKey: 'organizationId'
    })
    User.belongsTo(Location, {
      as: 'location',
      foreignKey: 'locationId'
    })
    User.belongsToMany(ClassEvent, {
      as: 'classEvents',
      through: ClassEventUser
    })
    User.hasMany(PhoneNumber, {
      as: 'phoneNumbers',
      foreignKey: 'phoneableId',
      constraints: false,
      scope: {
        phoneable: 'user'
      }
    })
    User.hasOne(Address, {
      as: 'address',
      foreignKey: 'addressableId',
      constraints: false,
      scope: {
        addressable: 'user'
      }
    })
    User.hasOne(Address, {
      as: 'billingAddress',
      foreignKey: 'addressableId',
      constraints: false,
      scope: {
        addressable: 'user-billing'
      }
    })
  }
  return User
}
