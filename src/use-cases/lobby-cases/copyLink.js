async function copyLinkInvite() {
    iconCopy.classList.replace("ph-copy", "ph-checks");
    var copyText = uuid;

    try { await navigator.clipboard.writeText(copyText); } catch (err) { console.error('Failed to copy: ', err) }

    setTimeout(() => {
        iconCopy.classList.replace("ph-checks", "ph-copy");
    }, 500);
}