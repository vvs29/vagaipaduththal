import React from 'react';
import Form from 'react-bootstrap/Form'

var MemberInfo = require("./MemberInfo");

class SuggestedMember extends React.Component {
    handleRadioSelect = e => {
        this.props.selectionCallback(this.props.memberInfo);
    }

    render() {
        var memberInfo = this.props.memberInfo;
        var labelText = MemberInfo.getMemberInfoAsString(memberInfo);
        return (
            // TODO: [UI] Show a button instead of this with hover animation and all
            <div style={{ border: 1 + "px solid", padding: 0.5 + "em", borderRadius: 1 + "em", marginBottom: 1 + "em" }}>
                <Form.Check 
                    type="radio" 
                    name="memberSelection1" 
                    id={"selectionid-" + memberInfo.mid} 
                    label={labelText}
                    onChange={this.handleRadioSelect} 
                    defaultChecked={this.props.isFirst} />
            </div>
        );
    }
}

class Suggestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestedMembers: []
        };
    }

    // Helper method to select the first suggestion
    selectFirstSuggestion() {
        const suggestedMembers = this.getSuggestions(this.props.inputString, this.props.members);
        this.setState({ suggestedMembers });
        
        if (suggestedMembers.length > 0 && suggestedMembers[0].mid && this.props.members[suggestedMembers[0].mid]) {
            this.props.selectionCallback(this.props.members[suggestedMembers[0].mid]);
        }
    }

    componentDidUpdate(prevProps) {
        // Check if inputString prop has changed
        if (prevProps.inputString !== this.props.inputString) {
            this.selectFirstSuggestion();
        }
    }

    componentDidMount() {
        // Select the first suggestion when the component first mounts
        this.selectFirstSuggestion();
    }

    getSuggestions(inputString, memberInfo) {
        var suggestionInfos = this.props.taggedData[inputString];
        var suggestedMemberInfos = [];
        if (suggestionInfos && suggestionInfos.mid !== "na") {
            suggestedMemberInfos.push(suggestionInfos);
        }
        return suggestedMemberInfos;
    }

    // need to define as an arrow function otherwise the this object isn't available inside.
    // see SuggestedMember's handleRadioSelect. this binds the method with the class.
    // we may also call .bind(this) like below
    handleSelect = function (e) {
        this.props.selectionCallback(this.memberList[e.target.selectedIndex + 1]);
    }.bind(this);

    render() {
        // TODO: [UI nicety] if selected from dropdown add this to the list of radio buttons and select it
        // TODO: sort items in dropdown alphabetically
        // TODO: typing should search all fields (name, nickname, id, email)
        this.memberList = this.props.members;

        // converting to array so I can use the map function
        this.memberListArray = [];
        for (var memberID in this.memberList) {
            if (this.memberList.hasOwnProperty(memberID)) {
                var memberInfo = this.memberList[memberID];
                this.memberListArray.push(memberInfo);
            }
        }

        return (
            <div>
                {this.state.suggestedMembers.map((member, i) => {
                    return member.mid ? 
                     <SuggestedMember 
                        key={i} 
                        memberInfo={this.props.members[member.mid]}
                        selectionCallback={this.props.selectionCallback} 
                        isFirst={i === 0} />
                        :""
                    })}
                <Form.Control as="select" onChange={this.handleSelect}>
                    {this.memberListArray.map((memberInfo, i) => <option key={"selmem" + i}>{MemberInfo.getMemberInfoAsString(memberInfo)}</option>)}
                </Form.Control>
            </div>
        );
    }
}

export default Suggestions;
