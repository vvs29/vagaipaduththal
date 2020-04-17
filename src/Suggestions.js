import React from 'react';
import Form from 'react-bootstrap/Form'
import memberInfoJSON from './res/memberInfo.json';
import suggestionsJSON from './res/mappings.json';

var MemberInfo = require("./MemberInfo");

class SuggestedMember extends React.Component {
    handleRadioSelect = e => {
        this.props.callback(this.props.memberInfo);
    }

    render() {
        var memberInfo = this.props.memberInfo;
        var labelText = MemberInfo.getMemberInfoAsString(memberInfo);
        return (
            // TODO: [UI] Show a button instead of this with hover animation and all
            <div style={{border: 1 + "px solid", padding: 0.5 + "em", borderRadius: 1 + "em", marginBottom: 1 + "em"}}>
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
        suggestionInfos.map((memID, i) => {
            suggestedMemberInfos.push(memberInfo[memID])
        });
        return suggestedMemberInfos;
    }

    // need to define as an arrow function otherwise the this object isn't available inside.
    // see SuggestedMember's handleRadioSelect. this binds the method with the class.
    // we may also call .bind(this) like below
    handleSelect = function (e) {
        this.props.callback(this.memberList[e.target.selectedIndex + 1]);
    }.bind(this);

    render() {
        // TODO: [UI nicety] if selected from dropdown add this to the list of radio buttons and select it
        // TODO: sort items in dropdown alphabetically
        // TODO: typing should search all fields (name, nickname, id, email)
        this.memberList = this.getMemberInfo();

        // converting to array so I can use the map function
        this.memberListArray = [];
        for (var memberID in this.memberList) {
            if (this.memberList.hasOwnProperty(memberID)) {
                var memberInfo = this.memberList[memberID];
                this.memberListArray.push(memberInfo);
            }
        }

        var suggestedMembers = this.getSuggestions(this.props.inputString, this.memberList);
        return (
            <div>
                {suggestedMembers.map((member, i) => <SuggestedMember key={i} memberInfo={member}
                                                                      callback={this.props.callback}/>)}
                <Form.Control as="select" onChange={this.handleSelect}>
                    {this.memberListArray.map((memberInfo, i) => <option>{MemberInfo.getMemberInfoAsString(memberInfo)}</option>)}
                </Form.Control>
            </div>
        );
    }
}

export default Suggestions;