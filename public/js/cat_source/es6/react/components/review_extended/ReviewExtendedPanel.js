let ReviewExtendedIssuesContainer = require('./ReviewExtendedIssuesContainer').default;
let ReviewVersionDiff = require('./ReviewVersionsDiff').default;
let ReviewExtendedIssuePanel = require('./ReviewExtendedIssuePanel').default;
let SegmentConstants = require('../../constants/SegmentConstants');
let SegmentStore = require('../../stores/SegmentStore');

class ReviewExtendedPanel extends React.Component{

    constructor(props) {
        super(props);
        this.originalTranslation = this.props.segment.translation;
        this.state = {
            translation: this.props.segment.translation,
            addIssue: false,
            selectionObj: null,
            diffPatch: null,
            versionNumber: this.props.segment.versions[0].version_number
        };

    }

    trackChanges(sid, editareaText) {
        let text = htmlEncode(UI.prepareTextToSend(editareaText));
        if (this.props.segment.sid === sid) {
            this.setState({
                translation: text,
            });
        }
    }

    textSelected(data, diffPatch) {
        this.setState({
            addIssue: true,
            selectionObj: data,
            diffPatch: diffPatch
        });
    }

    removeSelection() {
        this.setState({
            addIssue: false,
            selectionObj: null,
            diffPatch: null
        });
    }

    issueMouseEnter ( issue, event, reactid ) {
        SegmentActions.showSelection(this.props.sid, issue);
    }

    issueMouseLeave () {
        this.removeSelection();
    }

    getAllIssues () {
        let issues = [];
        this.props.segment.versions.forEach(function (version) {
            if ( !_.isEmpty(version.issues) ) {
                issues = issues.concat(version.issues);
            }
        });
        return issues;
    }

    componentWillReceiveProps (nextProps) {
        this.originalTranslation = htmlEncode(UI.prepareTextToSend(nextProps.segment.translation));
        this.setState({
            translation: this.originalTranslation,
            addIssue: false,
            selectionObj: null,
            diffPatch: null,
            versionNumber: nextProps.segment.versions[0].version_number
        });
    }

    componentDidMount() {
        SegmentStore.addListener(SegmentConstants.TRANSLATION_EDITED, this.trackChanges.bind(this));
    }

    componentWillUnmount() {
        SegmentStore.removeListener(SegmentConstants.TRANSLATION_EDITED, this.trackChanges);
    }

    render () {
        let issues = this.getAllIssues();
        return <div className="review-issues-overview-panel">
            <div className="review-version-wrapper">
                <div className="review-translation-version" >
                    <div className="review-version-header">
                        <h3>Live changes</h3>
                    </div>
                    <div className="collapsable">

                        <ReviewVersionDiff
                            textSelectedFn={this.textSelected.bind(this)}
                            removeSelection={this.removeSelection.bind(this)}
                            previousVersion={this.originalTranslation}
                            translation={this.state.translation}
                            segment={this.props.segment}
                            decodeTextFn={UI.decodeText}
                            selectable={this.props.isReview}
                        />


                        <div className="error-type">
                            <ReviewExtendedIssuePanel
                                sid={this.props.segment.sid}
                                selection={this.state.selectionObj}
                                segmentVersion={this.state.versionNumber}
                                diffPatch={this.state.diffPatch}
                                submitIssueCallback={this.removeSelection.bind(this)}
                                reviewType={this.props.reviewType}
                                segment={this.props.segment}
                            />
                        </div>
                        <ReviewExtendedIssuesContainer
                            issueMouseEnter={this.issueMouseEnter.bind(this)}
                            issueMouseLeave={this.issueMouseLeave.bind(this)}
                            reviewType={this.props.reviewType}
                            issues={issues}
                            sid={this.props.segment.sid}
                        />
                    </div>
                </div>
            </div>
        </div>;

    }
}

export default ReviewExtendedPanel ;