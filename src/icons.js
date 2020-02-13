import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBackspace,
    faCertificate,
    faChartBar,
    faChevronDown,
    faCode,
    faCog,
    faExclamationTriangle,
    faFileAlt,
    faFrown,
    faHistory,
    faHome,
    faList,
    faNetworkWired,
    faPen,
    faRemoveFormat,
    faSignOutAlt,
    faThumbsDown,
    faThumbsUp,
    faThumbtack,
    faTrashAlt,
    faUndoAlt,
    faUserCheck,
    faUserClock,
    faUserTimes
} from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import {
    faClock,
    faThumbsDown as faThumbsDownRegular,
    faThumbsUp as faThumbsUpRegular,
    faUser
} from '@fortawesome/free-regular-svg-icons';

export default function initIconLibrary() {
    library.add(faBackspace);
    library.add(faCertificate);
    library.add(faChartBar);
    library.add(faChevronDown);
    library.add(faClock);
    library.add(faCode);
    library.add(faCog);
    library.add(faExclamationTriangle);
    library.add(faFileAlt);
    library.add(faFrown);
    library.add(faHistory);
    library.add(faHome);
    library.add(faNetworkWired);
    library.add(faList);
    library.add(faMarkdown);
    library.add(faPen);
    library.add(faRemoveFormat);
    library.add(faSignOutAlt);
    library.add(faTrashAlt);
    library.add(faThumbsDown);
    library.add(faThumbsDownRegular);
    library.add(faThumbsUp);
    library.add(faThumbsUpRegular);
    library.add(faThumbtack);
    library.add(faUndoAlt);
    library.add(faUser);
    library.add(faUserCheck);
    library.add(faUserClock);
    library.add(faUserTimes);
}
