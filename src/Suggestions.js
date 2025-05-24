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
            suggestedMembers: [],
            inputValue: '',
            filteredMembers: [], // Will be populated with all members in componentDidMount
            inputFocused: false
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
            // Clear the textbox on page change
            this.setState({
                inputValue: '',
                filteredMembers: this.memberListArray
            });
        }
    }

    componentDidMount() {
        // Select the first suggestion when the component first mounts
        this.selectFirstSuggestion();

        // Initialize memberListArray for use in other methods
        this.initializeMemberListArray();

        // Initialize filteredMembers with all members
        this.setState({ filteredMembers: this.memberListArray });
    }

    // Initialize memberListArray from props.members
    initializeMemberListArray() {
        this.memberList = this.props.members;

        // converting to array so I can use the map function
        this.memberListArray = [];
        for (var memberID in this.memberList) {
            if (this.memberList.hasOwnProperty(memberID)) {
                var memberInfo = this.memberList[memberID];
                this.memberListArray.push(memberInfo);
            }
        }

        // Sort memberListArray by fullname
        this.memberListArray.sort((a, b) => a.fullname.localeCompare(b.fullname));
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

    // Handle input change for autocomplete
    handleInputChange = (e) => {
        const value = e.target.value;
        this.setState({ inputValue: value });

        if (value.length > 2) {
            // Filter members based on input value
            const filtered = this.memberListArray.filter(member =>
                MemberInfo.getMemberInfoAsString(member).toLowerCase().includes(value.toLowerCase())
            );
            this.setState({ filteredMembers: filtered });
        } else {
            // Show all members when input is empty or less than 3 characters
            this.setState({ filteredMembers: this.memberListArray });
        }
    };

    // Handle input focus
    handleInputFocus = () => {
        // Clear the textbox on focus
        this.setState({
            inputFocused: true,
            inputValue: '',
            filteredMembers: this.memberListArray
        });
    };

    // Handle input blur
    handleInputBlur = () => {
        // Use setTimeout to allow click events on dropdown items to fire before hiding the dropdown
        setTimeout(() => {
            this.setState({ inputFocused: false });
        }, 200);
    };

    // Handle selection from autocomplete dropdown
    handleAutocompleteSelect = (memberInfo) => {
        this.props.selectionCallback(memberInfo);
        this.setState({ inputValue: MemberInfo.getMemberInfoAsString(memberInfo) });
    };

    render() {
        // TODO: [UI nicety] if selected from dropdown add this to the list of radio buttons and select it

        // Re-initialize memberListArray in case props.members has changed
        this.initializeMemberListArray();

        return (
            <div>
                {this.state.suggestedMembers.map((member, i) => {
                    return member.mid ?
                        <SuggestedMember
                            key={i}
                            memberInfo={this.props.members[member.mid]}
                            selectionCallback={this.props.selectionCallback}
                            isFirst={i === 0} />
                        : ""
                })}
                <div className="autocomplete-dropdown" style={{ position: 'relative' }}>
                    <Form.Control
                        type="text"
                        placeholder="Type to search members (3+ chars to filter)"
                        value={this.state.inputValue}
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputBlur}
                    />
                    {this.state.inputFocused && this.state.filteredMembers.length > 0 && (
                        <div className="autocomplete-items" style={{
                            border: '1px solid #ddd',
                            maxHeight: '200px',
                            overflowY: 'scroll', // Always show scrollbar
                            position: 'absolute',
                            zIndex: 999,
                            width: '100%', // Match width of parent container
                            backgroundColor: 'white',
                            boxSizing: 'border-box' // Include padding and border in element's width and height
                        }}>
                            {this.state.filteredMembers.map((memberInfo, i) => (
                                <div
                                    key={"autocomplete-" + i}
                                    onClick={() => this.handleAutocompleteSelect(memberInfo)}
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                                >
                                    {MemberInfo.getMemberInfoAsString(memberInfo)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Suggestions;
