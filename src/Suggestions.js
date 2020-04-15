import React from 'react';
import Form from 'react-bootstrap/Form'
import memberInfoJSON from './res/memberInfo.json';
import suggestionsJSON from './res/mappings.json';

class SuggestedMember extends React.Component {
    handleRadioSelect = e => {
        this.props.callback(e.target.id.split("-")[1]);
    }

    render() {
        var memberInfo = this.props.memberInfo;
        var labelText = "ID:" + memberInfo.mid + " | " + memberInfo.fullname + " | " + memberInfo.nickname + " | "
            + memberInfo.email + " | Contribution Amount:" + memberInfo.contributionAmount;
        return (
            // TODO: [UI] Show a button instead of this with hover animation and all
            <div style={{border:1 + "px solid", padding: 0.5 + "em", borderRadius:1 + "em", marginBottom: 1 + "em"}}>
                <Form.Check type="radio" name="memberSelection1" id={"selectionid-" + memberInfo.mid} label={labelText}
                 onChange={this.handleRadioSelect}/>
            </div>
        );
    }
}

class Suggestions extends React.Component {
    getMemberInfo() {
        return memberInfoJSON;
    }

    getSuggestions(inputString, memberInfo) {
        var suggestionInfos = suggestionsJSON[inputString];
        var suggestedMemberInfos = [];
        suggestionInfos.map((memID,i) => {console.log(memID);suggestedMemberInfos.push(memberInfo[memID])});
        return suggestedMemberInfos;
    }

    // need to define as an arrow function otherwise the this object isn't available inside.
    // see SuggestedMember's handleRadioSelect. this binds the method with the class.
    // we may also call .bind(this) like below
    handleSelect = function(e) {
        this.props.callback(this.memberListStrings[e.target.selectedIndex].id);
    }.bind(this);

    render() {
        // TODO: [UI nicety] if selected from dropdown add this to the list of radio buttons and select it
        var memberList = this.getMemberInfo();
        this.memberListStrings = [];
        for (var memberID in memberList) {
            if (memberList.hasOwnProperty(memberID)) {
                var memberInfo = memberList[memberID];
                this.memberListStrings.push({ "id":memberID, "info": "ID:" + memberInfo.mid + " | " + memberInfo.fullname + " | " + memberInfo.nickname + " | "
                    + memberInfo.email + " | Contribution Amount:" + memberInfo.contributionAmount});
            }
        }

        var suggestedMembers = this.getSuggestions(this.props.inputString, memberList);
        return (
            <div>
                {suggestedMembers.map((member,i) => <SuggestedMember key={i} memberInfo={member} callback={this.props.callback} />)}
                <Form.Control as="select" onChange={this.handleSelect}>
                    {this.memberListStrings.map((memberInfo,i) => <option>{memberInfo.info}</option>)}
                </Form.Control>
            </div>
        );
    }
}

export default Suggestions;