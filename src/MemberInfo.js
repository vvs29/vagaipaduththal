var methods = {};

methods.getMemberInfoAsString = function (memberInfo) {
    return "ID:" + memberInfo.mid + " | " + memberInfo.fullname + " | " + memberInfo.nickname + " | "
        + memberInfo.email + " | Contribution Amount:" + memberInfo.contributionAmount
};

module.exports = methods;