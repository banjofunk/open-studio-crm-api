
module.exports = (sequelize, Datatypes) => {
  const StaffMember = sequelize.define("StaffMember", {
    active: { type: Datatypes.BOOLEAN },
    appointmentPayRates:{ type: Datatypes.JSON },
    description: { type: Datatypes.TEXT },
    email: { type: Datatypes.STRING },
    firstName: { type: Datatypes.STRING },
    gender: { type: Datatypes.STRING },
    mindbodyId: { type: Datatypes.INTEGER },
    organizationId: { type: Datatypes.INTEGER },
    roles: { type: Datatypes.JSON },
    lastName: { type: Datatypes.STRING },
    payRates: { type: Datatypes.JSON },
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

  StaffMember.associate = (models) => {
    const { Address, Organization, ClassEvent, ClassEventUser, PhoneNumber } = models
    StaffMember.belongsTo(Organization, {
      as: 'organization',
      foreignKey: 'organizationId'
    })
    StaffMember.belongsToMany(ClassEvent, {
      as: 'classEvents',
      through: ClassEventUser
    })
    StaffMember.hasMany(PhoneNumber, {
      as: 'phoneNumbers',
      foreignKey: 'phoneableId',
      constraints: false,
      scope: {
        phoneable: 'staff-member'
      }
    })
    StaffMember.hasOne(Address, {
      as: 'address',
      foreignKey: 'addressableId',
      constraints: false,
      scope: {
        addressable: 'staff-member'
      }
    })
  }
  return StaffMember
}
