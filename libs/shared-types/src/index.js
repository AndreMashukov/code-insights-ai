"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleColor = exports.RuleApplicability = exports.DIRECTORY_CONSTRAINTS = exports.DocumentStatus = exports.DocumentSourceType = void 0;
// Document Enums
var DocumentSourceType;
(function (DocumentSourceType) {
    DocumentSourceType["URL"] = "url";
    DocumentSourceType["UPLOAD"] = "upload";
    DocumentSourceType["GENERATED"] = "generated";
})(DocumentSourceType || (exports.DocumentSourceType = DocumentSourceType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["ACTIVE"] = "active";
    DocumentStatus["ARCHIVED"] = "archived";
    DocumentStatus["DELETED"] = "deleted";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
// Directory Constants
exports.DIRECTORY_CONSTRAINTS = {
    MAX_NAME_LENGTH: 100,
    MAX_DEPTH: 10,
    MAX_CHILDREN: 500,
    RESERVED_NAMES: ['root', 'system', 'admin'],
};
// Rules Feature Types
var RuleApplicability;
(function (RuleApplicability) {
    RuleApplicability["SCRAPING"] = "scraping";
    RuleApplicability["UPLOAD"] = "upload";
    RuleApplicability["PROMPT"] = "prompt";
    RuleApplicability["QUIZ"] = "quiz";
    RuleApplicability["FOLLOWUP"] = "followup";
    RuleApplicability["FLASHCARD"] = "flashcard";
    RuleApplicability["SLIDE_DECK"] = "slide_deck";
    RuleApplicability["DIAGRAM_QUIZ"] = "diagram_quiz";
    RuleApplicability["SEQUENCE_QUIZ"] = "sequence_quiz";
})(RuleApplicability || (exports.RuleApplicability = RuleApplicability = {}));
var RuleColor;
(function (RuleColor) {
    RuleColor["RED"] = "red";
    RuleColor["ORANGE"] = "orange";
    RuleColor["YELLOW"] = "yellow";
    RuleColor["GREEN"] = "green";
    RuleColor["BLUE"] = "blue";
    RuleColor["INDIGO"] = "indigo";
    RuleColor["PURPLE"] = "purple";
    RuleColor["PINK"] = "pink";
    RuleColor["GRAY"] = "gray";
})(RuleColor || (exports.RuleColor = RuleColor = {}));
//# sourceMappingURL=index.js.map