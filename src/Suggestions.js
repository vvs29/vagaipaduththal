import React from 'react';
import Form from 'react-bootstrap/Form'
import memberInfoJSON from './res/memberInfo.json';
import suggestionsJSON from './res/mappings.json';

class SuggestedMember extends React.Component {
    handleRadioSelect(e) {
        alert(e.target.id);
    }

    render() {
        var memberInfo = this.props.memberInfo;
        var labelText = "ID:" + memberInfo.mid + " | " + memberInfo.fullname + " | " + memberInfo.nickname + " | "
            + memberInfo.email + " | Contribution Amount:" + memberInfo.contributionAmount;
        return (
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
        console.log(suggestionInfos.length);
        var suggestedMemberInfos = []; //new Array(suggestionInfos.length);
        suggestionInfos.map((memID,i) => {console.log(memID);suggestedMemberInfos.push(memberInfo[memID])});
        console.log(suggestedMemberInfos);
        console.log(suggestedMemberInfos.length);
        return suggestedMemberInfos;
    }

    render() {
        // show a dropdown/autocomplete box to list all members/search for name or nickname
        // if selected from dropdown add this to the list of radio buttons and select it
        var memberInfo = this.getMemberInfo();
        var suggestedMembers = this.getSuggestions(this.props.inputString, memberInfo);
        return (
            <div>
                {suggestedMembers.map((member,i) => <SuggestedMember key={i} memberInfo={member} />)}
            </div>
        );
    }
}

export default Suggestions;